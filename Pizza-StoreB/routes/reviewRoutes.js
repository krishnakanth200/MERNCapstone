const express = require('express');
const { createReview, getReviewsByProduct, getReviewsByUser, updateReview, deleteReview } = require('../controllers/reviewControllers');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createReview);
router.get('/product/:productId', getReviewsByProduct);
router.get('/user', protect, getReviewsByUser);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
