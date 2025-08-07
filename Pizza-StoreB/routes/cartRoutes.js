const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartItemCount
} = require('../controllers/cartControllers');

// Define routes
router.get('/', protect, getCart);
router.get('/count', protect, getCartItemCount);
router.post('/add', protect, addToCart);
router.delete('/remove/:itemId', protect, removeFromCart);
router.put('/update/:itemId', protect, updateQuantity); // Ensure this route is defined

module.exports = router;
