const Receipt = require('../models/receiptModel');

const validatePasswordUpdate = (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    
    // If new password is provided, confirm password must match
    if (newPassword && newPassword.trim() !== '') {
        if (newPassword !== confirmPassword) {
            req.flash('error', 'New password and confirm password do not match');
            return res.redirect('/profile');
        }
        
        // Password strength validation
        if (newPassword.length < 6) {
            req.flash('error', 'Password must be at least 6 characters long');
            return res.redirect('/profile');
        }
    }
    
    next();
};

const validateProfileUpdate = async (req, res, next) => {
    const { name, email, phone } = req.body;
    const user = req.session.user;
    
    try {
        // Get receipts for re-rendering if needed
        const receipts = await Receipt.find({ email: user.email }).sort({ createdAt: -1 });
        
        // Name validation
        if (!name || name.trim().length < 2) {
            return res.render('profile', {
                user,
                receipts,
                error: 'Name must be at least 2 characters long'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.render('profile', {
                user,
                receipts,
                error: 'Please provide a valid email address'
            });
        }
        
        // Phone validation (optional)
        if (phone) {
            // Remove any non-digit characters (spaces, dashes, etc.)
            const cleanPhone = phone.replace(/[- ]/g, '');
            // Check if phone number has between 10 and 15 digits
            const phoneRegex = /^\d{10,15}$/;
            if (!phoneRegex.test(cleanPhone)) {
                return res.render('profile', {
                    user,
                    receipts,
                    error: 'Phone number must be between 10 and 15 digits'
                });
            }
        }
        
        next();
    } catch (error) {
        console.error('Error in validation:', error);
        return res.render('profile', {
            user,
            receipts: [],
            error: 'An error occurred while validating your information'
        });
    }
};

module.exports = {
    validatePasswordUpdate,
    validateProfileUpdate
}; 