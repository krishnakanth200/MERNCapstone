const express = require('express');
const {
    createOrder,
    getUserOrders,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getMonthlyRevenue,
    generateUserBill,
    generateUserBillForUser,
    cancelOrder,
    getDailyRevenue,
    getMostSoldItems,
    getUserBills  // Import the getUserBills function
} = require('../controllers/orderControllers');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Route for creating an order
router.post('/', protect, createOrder);

// Route for getting orders for a user
router.get('/myorders', protect, getUserOrders);

// Route for getting all orders (admin only)
router.get('/order', protect, authorize('admin'), getOrders);

// Route for getting an order by its ID
router.get('/:orderId', protect, getOrderById);

// Route for updating order status (admin only)
router.put('/:orderId/status', protect, authorize('admin'), updateOrderStatus);

// Route for deleting an order (admin only)
router.delete('/:orderId', protect, authorize('admin'), deleteOrder);

// Route for generating a bill for any user (admin only)
router.post('/user/:userId/bill', protect, authorize('admin'), generateUserBill);

// Route for generating a bill for the logged-in user
router.get('/mybill', protect, generateUserBillForUser);

// Route for getting all bills for the logged-in user
router.get('/bill/mybills', protect, getUserBills);  // Added this route

// Route for canceling an order (user only)
router.post('/:orderId/cancel', protect, cancelOrder);

// Route for getting monthly revenue (admin only)
router.get('/revenue/monthly', protect, authorize('admin'), getMonthlyRevenue);

// Route for getting daily revenue (admin only)
router.get('/revenue/daily', protect, authorize('admin'), getDailyRevenue);

// Route for getting most sold items (admin only)
router.get('/items/most-sold', protect, authorize('admin'), getMostSoldItems);

module.exports = router;
