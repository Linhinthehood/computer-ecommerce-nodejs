// controllers/authController.js

const User = require('../models/userModel');
const messageService = require('../services/messageService');
const emailService = require('../services/emailService');
const { QUEUES } = require('../config/rabbitmq');
const bcrypt = require('bcrypt');

/**
 * Generate a random password
 * @returns {string} Random password
 */
const generateRandomPassword = () => {
  const length = 10;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

/**
 * GET /auth
 * Render login/registration page
 */
exports.getAuthPage = (req, res) => {
  // Tên file view: auth.ejs
  res.render('auth', { 
    user: req.session.user || null, // Thêm user từ session
    loginError: null,
    signupError: null,
    formData: {}, // To preserve form data on error
    messages: req.flash()
  });
};

/**
 * POST /register
 * Handle registration
 */
exports.postRegister = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone,
      shippingAddress
    } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(400).json({ error: 'Email already registered.' });
      }
      return res.render('auth', { 
        user: req.session.user || null,
        loginError: null,
        signupError: 'Email already registered.',
        formData: req.body,
        messages: {}
      });
    }

    // Validate phone
    const cleanPhone = phone.replace(/[- ]/g, '');
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(400).json({ error: 'Phone number must be between 10 and 15 digits.' });
      }
      return res.render('auth', {
        user: req.session.user || null,
        loginError: null,
        signupError: 'Phone number must be between 10 and 15 digits.',
        formData: req.body,
        messages: {}
      });
    }

    // Generate random password
    const randomPassword = generateRandomPassword();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: cleanPhone,
      shippingAddress,
      isFirstLogin: true,
      passwordChangeRequired: true
    });

    await newUser.save();
    console.log("New user created:", newUser);

    // Send welcome email with password
    await emailService.sendWelcomeEmail({
      name,
      email: email.toLowerCase(),
      password: randomPassword
    });

    // Set session
    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      shippingAddress: newUser.shippingAddress,
      isFirstLogin: true,
      passwordChangeRequired: true
    };

    if (req.headers['content-type'] === 'application/json') {
      return res.status(201).json({
        message: 'Registration successful. Please check your email for login credentials.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          shippingAddress: newUser.shippingAddress
        }
      });
    }

    // Set flash message and redirect to home
    req.flash('success', 'Registration successful! Please check your email for your password.');
    return res.redirect('/');

  } catch (err) {
    console.error(err);
    if (req.headers['content-type'] === 'application/json') {
      return res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
    return res.render('auth', { 
      user: req.session.user || null,
      loginError: null,
      signupError: 'Registration failed. Please try again.',
      formData: req.body,
      messages: {}
    });
  }
};

/**
 * POST /login
 * Handle login
 */
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      return res.render('auth', { 
        user: req.session.user || null,
        loginError: 'Invalid email or password.',
        signupError: null,
        formData: req.body
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      return res.render('auth', { 
        user: req.session.user || null,
        loginError: 'Invalid email or password.',
        signupError: null,
        formData: req.body
      });
    }

    // Set session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      shippingAddress: user.shippingAddress,
      isFirstLogin: user.isFirstLogin,
      passwordChangeRequired: user.passwordChangeRequired
    };

    // Check if password change is required
    if (user.passwordChangeRequired) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(200).json({
          message: 'Login successful but password change required',
          requirePasswordChange: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
      }
      return res.redirect("/profile/change-password?required=true");
    }

    if (req.headers['content-type'] === 'application/json') {
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          shippingAddress: user.shippingAddress
        }
      });
    }

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    if (req.headers['content-type'] === 'application/json') {
      return res.status(500).json({ error: 'Login failed. Please try again.' });
    }
    return res.render('auth', { 
      user: req.session.user || null,
      loginError: 'Login failed. Please try again.',
      signupError: null,
      formData: req.body
    });
  }
};