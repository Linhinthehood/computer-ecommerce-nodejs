const Receipt = require('../models/receiptModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res, next) => {
  try {
    const user = req.session.user;
    // Truy vấn danh sách đơn hàng (receipt) theo email
    const receipts = await Receipt.find({ email: user.email }).sort({ createdAt: -1 });
    // Render trang profile kèm thông tin user và receipts
    res.render('profile', { user, receipts });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.render('profile', { 
        user: req.session.user, 
        receipts: [],
        error: 'User not found' 
      });
    }

    // Check if password is in bcrypt format
    if (!user.password.startsWith('$2')) {
      return res.render('profile', { 
        user: req.session.user, 
        receipts: [],
        error: 'Your account needs to be updated with the new security system. Please contact support.' 
      });
    }

    // Verify current password using bcrypt
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.render('profile', { 
        user: req.session.user, 
        receipts: [],
        error: 'Current password is incorrect' 
      });
    }

    // Update user information
    user.name = name;
    user.email = email;
    user.phone = phone;
    
    // Update password if provided
    if (newPassword && newPassword.trim() !== '') {
      // Verify password confirmation
      if (newPassword !== confirmPassword) {
        return res.render('profile', { 
          user: req.session.user, 
          receipts: [],
          error: 'New password and confirmation do not match' 
        });
      }

      // Password validation
      if (newPassword.length < 6) {
        return res.render('profile', { 
          user: req.session.user, 
          receipts: [],
          error: 'New password must be at least 6 characters long' 
        });
      }

      // Hash the new password
      const saltRounds = 10;
      user.password = await bcrypt.hash(newPassword, saltRounds);
    }

    await user.save();

    // Update session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.render('profile', { 
      user: req.session.user, 
      receipts: [],
      error: 'An error occurred while updating your profile' 
    });
  }
};


