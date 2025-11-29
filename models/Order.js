const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
items: [
{
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
qty: { type: Number, default: 1 }
}
],
total: { type: Number, default: 0 },
status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered'], default: 'pending' },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', orderSchema);