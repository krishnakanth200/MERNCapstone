const Notification = require('../models/notificationModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Send Notification
exports.sendNotification = async (req, res) => {
    const { userId, message, orderId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const notification = new Notification({
            user: userId,
            message,
            order: orderId
        });

        await notification.save();
        res.status(201).json({ message: 'Notification sent', notification });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User Notifications
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mark Notification as Read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.read = true;
        await notification.save();
        res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Trigger notifications in order status update
exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        const notification = new Notification({
            user: order.user,
            message: `Your order #${order._id} status has been updated to ${status}`,
            order: orderId
        });
        await notification.save();

        res.json({ message: 'Order status updated and notification sent', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Trigger notifications in product addition
exports.addProduct = async (req, res) => {
    const { name, price, description } = req.body;

    try {
        const product = new Product({ name, price, description });
        await product.save();

        const users = await User.find({});
        for (const user of users) {
            const notification = new Notification({
                user: user._id,
                message: `New product added: ${product.name}`,
            });
            await notification.save();
        }

        res.status(201).json({ message: 'Product added and notifications sent', product });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Trigger notifications in bill generation
exports.generateBill = async (req, res) => {
    const { userId, items, totalAmount } = req.body;

    try {
        const bill = new Bill({ user: userId, items, totalAmount });
        await bill.save();

        const notification = new Notification({
            user: userId,
            message: `Your bill has been generated. Total amount: $${totalAmount}`,
        });
        await notification.save();

        res.status(201).json({ message: 'Bill generated and notification sent', bill });
    } catch (error) {
        console.error('Error generating bill:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
