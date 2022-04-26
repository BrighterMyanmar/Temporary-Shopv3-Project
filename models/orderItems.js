const mongoose = require('mongoose')
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
   order: { type: Schema.Types.ObjectId, ref: "order", required: true },
   count: { type: Number, required: true },
   productId: { type: Schema.Types.ObjectId, required: true, ref: "product" },
   name: { type: String, require: true },
   price: { type: Number, require: true },
   status: { type: String, enum: ["ACCEPT", "PENDING", "DELIVERED"], default: "ACCEPT" },
   created: { type: Date, default: Date.now }
});

const OrderItem = mongoose.model('orderitem', OrderItemSchema);
module.exports = OrderItem;
