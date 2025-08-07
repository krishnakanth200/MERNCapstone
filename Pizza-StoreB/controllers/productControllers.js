const mongoose = require('mongoose');
const Product = require('../models/productModel');

// Create Product (Admin Only)
exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, tax, discount, category, image } = req.body;
        console.log('Received Product Data:', req.body);
        const product = new Product({ name, price, description, tax, discount, category, image });
        await product.save();
        res.status(201).json({ message: 'Item has been added', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error('Error in getProducts:', error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error('Error in getProductById:', error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update Product (Admin Only)
exports.updateProduct = async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const { name, price, description, tax, discount, category, image } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the product fields only if they are provided in the request body
        if (name) product.name = name;
        if (price) product.price = price;
        if (description) product.description = description;
        if (tax) product.tax = tax;
        if (discount) product.discount = discount;
        if (category) product.category = category;
        if (image) product.image = image; // Update the image field if provided

        await product.save();
        res.json({ message: 'Product updated', product });
    } catch (error) {
        console.error('Error in updateProduct:', error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Products by Category
exports.getProductsByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const products = await Product.find({ category });
        if (products.length === 0) {
            return res.status(404).json({ message: `No products found in category: ${category}` });
        }
        res.json(products);
    } catch (error) {
        console.error('Error in getProductsByCategory:', error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete Product (Admin Only)
exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.findByIdAndDelete(productId);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error in deleteProduct:', error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Search Products
exports.searchProducts = async (req, res) => {
    const { category, price, availability, name } = req.query;
    let query = {};

    if (category) query.category = category;
    if (price) query.price = { $lte: price };
    if (availability) query.availability = availability;
    if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive search by name

    try {
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error in searchProducts:', error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
