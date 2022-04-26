const mongoose = require('mongoose')
const { Schema } = mongoose;

const ChildcatSchema = new Schema({
   subcatId: { type: Schema.Types.ObjectId, ref: "subcat" },
   name: { type: String, required: true, unique: true },
   image: { type: String, required: true },
   created: { type: Date, default: Date.now }
});

const Childcat = mongoose.model('childcat', ChildcatSchema);
module.exports = Childcat;
