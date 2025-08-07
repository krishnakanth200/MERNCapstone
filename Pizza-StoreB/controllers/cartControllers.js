const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Get Cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Calculate total amount
        let totalAmount = 0;
        cart.items.forEach(item => {
            const product = item.product;
            if (product) { // Ensure product is not null
                const itemTotal = product.price * item.quantity;
                const itemTax = product.tax * item.quantity;
                totalAmount += itemTotal + itemTax;
            } else {
                console.warn(`Product not found for item ${item._id}`);
            }
        });

        res.json({ cart, totalAmount });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add to Cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [{ product: productId, quantity }] });
        } else {
            const existingItem = cart.items.find(item => item.product.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be greater than 0' });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(item => item._id.toString() === itemId);
        if (!item) return res.status(404).json({ message: 'Item not found in cart' });

        item.quantity = quantity;
        await cart.save();

        // Recalculate total amount
        const totalAmount = cart.items.reduce((acc, item) => {
            const product = item.product;
            if (product) {
                return acc + (product.price * item.quantity) + (product.tax * item.quantity);
            } else {
                console.warn(`Product not found for item ${item._id}`);
                return acc;
            }
        }, 0);

        res.json({ cart, totalAmount });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Cart Item Count
exports.getCartItemCount = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) return res.json({ count: 0 });

        const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
        res.json({ count: itemCount });
    } catch (error) {
        console.error('Error fetching cart item count:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
