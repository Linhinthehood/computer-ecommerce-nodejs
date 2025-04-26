const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middlewares/auth');
const { validateProfileUpdate, validatePasswordUpdate } = require('../middlewares/validation');

// Protected routes - require authentication
router.get('/profile', isAuthenticated, profileController.getProfile);
router.post('/profile/update', 
    isAuthenticated, 
    validateProfileUpdate,
    validatePasswordUpdate,
    profileController.updateProfile
);

module.exports = router;