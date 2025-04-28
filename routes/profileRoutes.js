const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middlewares/auth');
const { validateProfileUpdate } = require('../middlewares/validation');

// Protected routes - require authentication
router.get('/profile', isAuthenticated, profileController.getProfile);

// Password change routes
router.get('/profile/change-password', isAuthenticated, profileController.getChangePassword);
router.post('/profile/change-password', isAuthenticated, profileController.changePassword);

// Profile update route
router.post('/profile/update', 
    isAuthenticated, 
    validateProfileUpdate,
    profileController.updateProfile
);

// Address management routes
router.post('/profile/addresses', isAuthenticated, profileController.addAddress);
router.put('/profile/addresses/:addressId', isAuthenticated, profileController.updateAddress);
router.delete('/profile/addresses/:addressId', isAuthenticated, profileController.removeAddress);
router.put('/profile/addresses/:addressId/default', isAuthenticated, profileController.setDefaultAddress);

module.exports = router;