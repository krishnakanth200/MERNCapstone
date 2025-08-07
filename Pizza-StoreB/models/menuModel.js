const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the category or item
    description: { type: String }, // Description of the category
    image: { type: String }, // Path to the uploaded image
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Array of product references
});

module.exports = mongoose.model('Menu', menuSchema);
