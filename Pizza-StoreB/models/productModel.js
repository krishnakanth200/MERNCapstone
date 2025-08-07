const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    tax: { type: Number },
    discount: { type: Number },
    category: { type: String, required: true },
    image: { type: String }, // Ensure this matches the field used in your controller
   //availability: { type: Boolean, default: true } // If availability is used
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
