const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, require : true},
    address: {type: String, require: true},
    mobile: {type: String, require: true, unique: true},
    s_mobile: {type: String},
    balance:{type: Number, default:0}
})

module.exports = mongoose.model('Customer', customerSchema);