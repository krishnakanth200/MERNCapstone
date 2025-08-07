const express = require('express');
const { createPayment, getPaymentByOrder, updatePayment, deletePayment } = require('../controllers/paymentControllers');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createPayment);
router.get('/order/:orderId', getPaymentByOrder);
router.put('/:paymentId', protect, authorize('admin'), updatePayment);
router.delete('/:paymentId', protect, authorize('admin'), deletePayment);

module.exports = router;
