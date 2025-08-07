const express = require('express');
const { addMenu, getMenus, getMenuById, updateMenu, deleteMenu } = require('../controllers/menuControllers');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to get all menus
router.get('/', getMenus); // This is accessible to everyone

// Routes for menu operations (admin only)
router.post('/', protect, authorize('admin'), addMenu); // Add a new menu item with image upload
router.get('/:menuId', getMenuById); // Get a single menu item by ID (public or restricted as needed)
router.put('/:menuId', protect, authorize('admin'), updateMenu); // Update a menu item with optional image upload
router.delete('/:menuId', protect, authorize('admin'), deleteMenu); // Delete a menu item

module.exports = router;
