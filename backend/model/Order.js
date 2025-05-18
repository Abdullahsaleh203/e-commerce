const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
