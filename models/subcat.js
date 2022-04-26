const mongoose = require('mongoose')
const { Schema } = mongoose;

const SubcatSchema = new Schema({
   catId: { type: Schema.Types.ObjectId, ref: "cat" },
   name: { type: String, required: true, unique: true },
   image: { type: String, required: true },
   childcats: [{ type: Schema.Types.ObjectId, ref: "childcat" }],
   created: { type: Date, default: Date.now }
});

const Subcat = mongoose.model('subcat', SubcatSchema);
module.exports = Subcat;
