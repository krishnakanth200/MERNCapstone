const express = require('express');
const {
    sendNotification,
    getUserNotifications,
    markAsRead
} = require('../controllers/notificationControllers');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin'), sendNotification); // Admin only
router.get('/mynotifications', protect, getUserNotifications); // User notifications
router.put('/:notificationId/read', protect, markAsRead); // Mark as read

module.exports = router;
