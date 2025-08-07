const express = require('express');
const { 
    registerUser, loginUser, logoutUser, 
    getUserProfile, updateUserProfile, 
    deleteUser, getAllUsers 
} = require('../controllers/userControllers');
const { protect, authorize, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile/delete', protect,authorize('admin'), deleteUser);

router.get('/useraccounts', protect, authorize('admin'), getAllUsers); // Endpoint to get all users

module.exports = router;
