const express = require('express');
const { 
    addProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    getProductsByCategory, 
    searchProducts
} = require('../controllers/productControllers');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/search', searchProducts); // Ensure the search route comes before the dynamic :productId route
router.get('/category/:category', getProductsByCategory);
router.get('/', getProducts); 
router.get('/:productId', getProductById); 

// Admin-only routes
router.post('/', protect, authorize('admin'), addProduct);
router.put('/:productId', protect, authorize('admin'), updateProduct); 
router.delete('/:productId', protect, authorize('admin'), deleteProduct);

module.exports = router;
