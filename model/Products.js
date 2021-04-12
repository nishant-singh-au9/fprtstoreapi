const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: 'string', required: true},
    image: { type: 'string', required: true},
    vendorEmail: { type: 'string', required: true},
    quantity: { type: 'string', required: true},
    status: { type: 'string', required: true},
    brand: { type: 'string', required: true},
    category: { type: 'string', required: true},
    price: { type: 'string', required: true}
})


module.exports = Product = mongoose.model("products", ProductSchema);