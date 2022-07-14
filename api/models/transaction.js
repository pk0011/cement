const mongoose = require('mongoose');
const Customer = require('../models/customer')

const transactionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customer: {type: mongoose.Schema.Types.ObjectId, ref : 'Customer', required: true},
    amount: {type: Number, default: 0},
    txn_type: {type:Boolean, required: true},
    date: {type: Date, require: true},
    description: { type: String},
    cur_bal : {type: Number, default: 0},
    bill_date : {type: String, require: true},
    active : {type:Boolean, required: true, default: 1},
})

module.exports = mongoose.model('Transaction', transactionSchema);