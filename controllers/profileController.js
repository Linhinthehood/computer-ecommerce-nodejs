const Receipt = require('../models/receiptModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const emailService = require('../services/emailService');

exports.getProfile = async (req, res, next) => {
  try {
    const user = req.session.user;
    // Fetch receipts by email
    const receipts = await Receipt.find({ email: user.email }).sort({ createdAt: -1 });
    // Render profile page with user info and receipts
    res.render('profile', { 
      user, 
      receipts,
      error: null,
      success: null
    });
  } catch (error) {
    next(error);
  }
};

exports.getChangePassword = async (req, res) => {
  const isRequired = req.query.required === 'true';
  res.render('change-password', {
    user: req.session.user,
    isRequired,
    error: null,
    success: null
  });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, street, ward, district, city } = req.body;
    const userId = req.session.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.render('profile', { 
        user: req.session.user, 
        receipts: [],
        error: 'User not found',
        success: null
      });
    }

    // Update user information
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.shippingAddress = {
      street,
      ward,
      district,
      city
    };
    
    await user.save();

    // Update session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      shippingAddress: user.shippingAddress,
      isFirstLogin: user.isFirstLogin,
      passwordChangeRequired: user.passwordChangeRequired
    };

    // Fetch latest receipts
    const receipts = await Receipt.find({ email: user.email }).sort({ createdAt: -1 });

    res.render('profile', { 
      user: req.session.user, 
      receipts,
      error: null,
      success: 'Profile updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.render('profile', { 
      user: req.session.user, 
      receipts: [],
      error: 'An error occurred while updating your profile',
      success: null
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const isRequired = req.query.required === 'true';
    const userId = req.session.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.render('change-password', {
        user: req.session.user,
        isRequired,
        error: 'User not found',
        success: null
      });
    }

    // For first-time login or required password change, skip current password check
    if (!isRequired) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.render('change-password', {
          user: req.session.user,
          isRequired,
          error: 'Current password is incorrect',
          success: null
        });
      }
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.render('change-password', {
        user: req.session.user,
        isRequired,
        error: 'New password must be at least 6 characters long',
        success: null
      });
    }

    // Confirm new password
    if (newPassword !== confirmPassword) {
      return res.render('change-password', {
        user: req.session.user,
        isRequired,
        error: 'New password and confirmation do not match',
        success: null
      });
    }

    // Hash and save new password
    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    user.isFirstLogin = false;
    user.passwordChangeRequired = false;
    user.lastPasswordChange = new Date();
    await user.save();

    // Update session
    req.session.user = {
      ...req.session.user,
      isFirstLogin: false,
      passwordChangeRequired: false
    };

    if (req.headers['content-type'] === 'application/json') {
      return res.status(200).json({
        message: 'Password changed successfully'
      });
    }

    // Set flash message and redirect to home
    req.flash('success', 'Password changed successfully. You can now use your new password to log in.');
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return res.render('change-password', {
      user: req.session.user,
      isRequired: req.query.required === 'true',
      error: 'An error occurred while changing your password',
      success: null
    });
  }
};


