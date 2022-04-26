const mongoose = require('mongoose')
const { Schema } = mongoose;

const PermitSchema = new Schema({
   name: { type: String, required: true },
});

const Permit = mongoose.model('permit', PermitSchema);
module.exports = Permit;
