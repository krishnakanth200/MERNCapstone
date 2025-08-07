const Payment = require('../models/paymentModel');
const Order = require('../models/orderModel');

// Create Payment
exports.createPayment = async (req, res) => {
    try {
        const { order, paymentMethod, amount } = req.body;
        const orderExists = await Order.findById(order);
        if (!orderExists) return res.status(404).json({ message: 'Order not found' });

        const payment = new Payment({ order, paymentMethod, amount });
        await payment.save();
        res.status(201).json({ message: 'Payment created', payment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Payment by Order ID
exports.getPaymentByOrder = async (req, res) => {
    try {
        const payment = await Payment.findOne({ order: req.params.orderId });
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update Payment
exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        const { paymentMethod, paymentStatus, amount } = req.body;
        Object.assign(payment, { paymentMethod, paymentStatus, amount });
        await payment.save();
        res.json({ message: 'Payment updated', payment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete Payment
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        await Payment.findByIdAndDelete(req.params.paymentId);
        res.json({ message: 'Payment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
