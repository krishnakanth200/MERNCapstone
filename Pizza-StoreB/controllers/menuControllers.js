const Menu = require('../models/menuModel');
const upload = require('../middleware/upload'); // Your existing upload middleware

// Add a new category or menu item
exports.addMenu = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err });
            }

            const { name, description, products } = req.body;
            const image = req.file ? req.file.path : null; // Use the uploaded image path

            const menu = new Menu({ name, description, image, products });
            await menu.save();
            res.status(201).json({ message: 'Menu item added', menu });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all menu items
exports.getMenus = async (req, res) => {
    try {
        const menus = await Menu.find().populate('products');
        res.json(menus);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single menu item by ID
exports.getMenuById = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.menuId).populate('products');
        if (!menu) return res.status(404).json({ message: 'Menu item not found' });
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a menu item
exports.updateMenu = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err });
            }

            const menu = await Menu.findById(req.params.menuId);
            if (!menu) return res.status(404).json({ message: 'Menu item not found' });

            const { name, description, products } = req.body;

            if (req.file) {
                menu.image = req.file.path; // Update image path if a new image is uploaded
            }

            menu.name = name || menu.name;
            menu.description = description || menu.description;
            menu.products = products || menu.products;

            await menu.save();
            res.json({ message: 'Menu item updated', menu });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a menu item
exports.deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.menuId);
        if (!menu) return res.status(404).json({ message: 'Menu item not found' });

        await Menu.findByIdAndDelete(req.params.menuId);
        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
