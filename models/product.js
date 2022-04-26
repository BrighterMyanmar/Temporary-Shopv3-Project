const mongoose = require('mongoose')
const { Schema } = mongoose;

const ProductSchema = new Schema({
   name: { type: String, required: true, unique: true },
   price: { type: Number, required: true },
   images: { type: Array, required: true },
   desc: { type: String, required: true },
   content: { type: String, required: true },
   colors: { type: Array, required: true },
   cat: { type: Schema.Types.ObjectId, required: true, ref: "cat" },
   subcat: { type: Schema.Types.ObjectId, required: true, ref: "subcat" },
   childcat: { type: Schema.Types.ObjectId, required: true, ref: "childcat" },
   created: { type: Date, default: Date.now }
});

const Product = mongoose.model('product', ProductSchema);
module.exports = Product;
