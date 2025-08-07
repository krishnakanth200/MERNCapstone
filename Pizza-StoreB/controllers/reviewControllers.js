const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Create Review
exports.createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;
        const user = req.user.id;

        const productExists = await Product.findById(product);
        if (!productExists) return res.status(404).json({ message: 'Product not found' });

        const review = new Review({ product, user, rating, comment });
        await review.save();
        res.status(201).json({ message: 'Review created', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get All Reviews for a Product
exports.getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate('user', 'username');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Reviews by User
exports.getReviewsByUser = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id }).populate('product', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Review
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { rating, comment } = req.body;
        Object.assign(review, { rating, comment });
        await review.save();
        res.json({ message: 'Review updated', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete Review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Review.findByIdAndDelete(req.params.reviewId);
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
