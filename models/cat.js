const mongoose = require('mongoose')
const { Schema } = mongoose;

const CatSchema = new Schema({
   name: { type: String, required: true, unique: true },
   image: { type: String, required: true },
   subcats: [{ type: Schema.Types.ObjectId, ref: "subcat" }],
   created: { type: Date, default: Date.now }
});

const Cat = mongoose.model('cat', CatSchema);
module.exports = Cat;
