const mongoose = require('mongoose')
const { Schema } = mongoose;

const OrderSchema = new Schema({
   user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
   items: [{ type: Schema.Types.ObjectId, required: true, ref: 'orderitem' }],
   count: { type: Number, required: true },
   total: { type: Number, required: true },
   created: { type: Date, default: Date.now }
});

const Order = mongoose.model('order', OrderSchema);
module.exports = Order;
