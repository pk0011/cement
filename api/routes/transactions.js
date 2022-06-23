const express =require('express');
const router = express.Router();
const Customer = require('../models/customer')
const Transaction = require('../models/transaction')
const mongoose = require('mongoose');
const customer = require('../models/customer');


router.post('/',(req, res, next) => {
    const id = String(req.body.customerID);
    console.log(id)
    Customer.findById(id)
    .then(customer => {
        console.log("I am starting--------------------------------",customer)
        if(!customer) {
            res.status(404).json({
                    message: "Customer not found",     
            })
        }
        else{
            
            //Updating customer balance
            const balance = customer.balance
            var newbalance = 0
            if(req.body.txn_type == 1){
                console.log("Hello")
            newbalance = Number(balance) + Number(req.body.amount)
            }
            else{
                newbalance = Number(balance) - Number(req.body.amount)

            }

            Customer.updateOne({_id: id},{ $set: {balance: newbalance}})
            .exec()
            .then()
            .catch()

            //creating new trancsaction
        const transaction = new Transaction({
            _id: mongoose.Types.ObjectId(),
            customer: req.body.customerID,
            amount: req.body.amount,
            txn_type: req.body.txn_type,
            date: Date.now()
        })
        console.log("Transaction created: ",transaction)
        
        return transaction
        .save()
        .then(result => {
            res.status(201).json({
                message : "Transaction created",
                createdTransaction: 
                {
                _id: result._id,
                amount: result.amount,
                txn_type: result.txn_type
                },
            })
        })
        
    }})
    .catch(err => {
        res.status(500).json({
            errors : err
        })
    })   
})


//get for specific customer

router.get('/:customer',(req, res, next) => {
    const id = String(req.params.customer);

   Transaction.find({customer: id})
//    .populate("customer")
   .exec()
   .then(doc => {
       console.log("From DB", doc);
       if (doc){
        res.status(200).json({
            count: doc.length,
            transactions: doc,
        });
       }
       else{
           res.status(404).json({message: "No transaction found"})
       }
   })
   .catch(err => {
       console.log(err)
       res.status(500).json({error: err})
})
});


module.exports = router;