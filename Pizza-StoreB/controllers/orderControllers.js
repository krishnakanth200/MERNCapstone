const BillModel = require('../models/BillModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Create Order
exports.createOrder = async (req, res) => {
    const { items } = req.body;

    try {
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items should be a non-empty array of IDs' });
        }

        const products = await Product.find({ _id: { $in: items } });

        if (products.length !== items.length) {
            return res.status(404).json({ message: 'Some products were not found for the provided IDs' });
        }

        const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

        const order = new Order({
            items,
            user: req.user._id,
            totalAmount
        });

        await order.save();

        res.status(201).json({ message: 'Order created', order });
    } catch (error) {
        console.error('Error creating order:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User Orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items').populate('user', 'username email');
        res.json(orders);
    } catch (error) {
        console.error('Error retrieving user orders:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Orders (Admin Only)
exports.getOrders = async (req, res) => {
    const { status } = req.query;
    const query = {};

    if (status) {
        query.status = status;
    }

    try {
        const orders = await Order.find(query).populate('user', 'username email').populate('items');
        res.json(orders);
    } catch (error) {
        console.error('Error retrieving orders:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('user', 'username email').populate('items');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        console.error('Error retrieving order:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Monthly Revenue
exports.getMonthlyRevenue = async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);

        const revenue = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lt: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        res.json({
            message: 'Monthly revenue fetched',
            revenue: revenue[0] ? revenue[0].totalRevenue : 0
        });
    } catch (error) {
        console.error('Error fetching monthly revenue:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Order Status (Admin Only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.query;
        const { orderId } = req.params;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Order (Admin Only)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await Order.findByIdAndDelete(req.params.orderId);

        res.json({ message: 'Order deleted' });
    } catch (error) {
        console.error('Error deleting order:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Generate Bill for Any User (Admin Only)
exports.generateUserBill = async (req, res) => {
    const userId = req.params.userId;

    try {
        const orders = await Order.find({ user: userId }).populate('items');

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        let totalAmount = 0;
        const orderDetails = orders.map(order => {
            const orderItems = order.items.map(item => ({
                name: item.name,
                price: item.price,
                quantity: order.items.filter(id => id.equals(item._id)).length
            }));
            totalAmount += order.totalAmount;
            return {
                orderId: order._id,
                items: orderItems,
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt
            };
        });

        const bill = {
            userId,
            totalAmount,
            orderDetails
        };

        const newBill = new BillModel({
            user: userId,
            totalAmount: totalAmount,
            orderDetails: orderDetails,
            createdAt: new Date()
        });

        await newBill.save();

        res.json({
            message: 'Bill generated and stored successfully',
            bill: newBill
        });
    } catch (error) {
        console.error('Error generating and storing bill:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Generate Bill for Logged-in User
exports.generateUserBillForUser = async (req, res) => {
    const userId = req.user._id;

    try {
        const orders = await Order.find({ user: userId }).populate('items');

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        let totalAmount = 0;
        const orderDetails = orders.map(order => {
            const orderItems = order.items.map(item => ({
                name: item.name,
                price: item.price,
                quantity: order.items.filter(id => id.equals(item._id)).length
            }));
            totalAmount += order.totalAmount;
            return {
                orderId: order._id,
                items: orderItems,
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt
            };
        });

        const bill = {
            userId,
            totalAmount,
            orderDetails
        };

        const newBill = new BillModel({
            user: userId,
            totalAmount: totalAmount,
            orderDetails: orderDetails,
            createdAt: new Date()
        });

        await newBill.save();

        res.json({
            message: 'Bill generated and stored successfully',
            bill: newBill
        });
    } catch (error) {
        console.error('Error generating and storing bill:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only cancel your own orders' });
        }

        if (order.status === 'accepted') {
            return res.status(400).json({ message: 'Cannot cancel an accepted order' });
        }

        order.status = 'canceled';
        await order.save();

        res.json({ message: 'Order canceled successfully', order });
    } catch (error) {
        console.error('Error canceling order:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Daily Revenue
exports.getDailyRevenue = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const revenue = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfDay,
                        $lt: endOfDay
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        res.json({
            message: 'Daily revenue fetched',
            revenue: revenue[0] ? revenue[0].totalRevenue : 0
        });
    } catch (error) {
        console.error('Error fetching daily revenue:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Most Sold Items
exports.getMostSoldItems = async (req, res) => {
    try {
        const items = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items", totalQuantity: { $sum: 1 } } },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: "$product" }
        ]);

        res.json(items.map(item => ({
            productId: item._id,
            name: item.product.name,
            totalQuantity: item.totalQuantity
        })));
    } catch (error) {
        console.error('Error fetching most sold items:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserBills = async (req, res) => {
    const userId = req.user._id;

    try {
        const bills = await BillModel.find({ user: userId });

        if (bills.length === 0) {
            return res.status(404).json({ message: 'No bills found for this user' });
        }

        res.json({
            message: 'Bills fetched successfully',
            bills
        });
    } catch (error) {
        console.error('Error fetching bills:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};