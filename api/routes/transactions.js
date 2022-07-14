const express =require('express');
const router = express.Router();
const Customer = require('../models/customer')
const Transaction = require('../models/transaction')
const mongoose = require('mongoose');
const customer = require('../models/customer');
const multer = require('multer')
const path = require("path");
const { Socket } = require('dgram');


// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename: (req, file, cb) => {
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 100000
//     }
// })


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
            date: Date.now(),
            description: req.body.description,
            cur_bal : newbalance,
            bill_date : req.body.bill_date
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
    //    console.log("From DB", doc);
       if (doc){
        var bal = 0
        for (const key of doc){
            if (key.txn_type == false && key.active == true){
                bal = bal-key.amount
            }
            else if(key.txn_type == true && key.active == true){
                bal = bal+key.amount
            }
            key.cur_bal = bal
            Transaction.updateOne({_id: key._id},{ $set: {cur_bal: bal}})
            .exec()
            .then()
            .catch()
        }
        res.status(200).json({
            Count: doc.length,
            Balance: bal,
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


router.get('/txn_id/:txn_id',(req, res, next) => {
    const id = req.params.txn_id;
   Transaction.findById(id)
   .exec()
   .then(doc => {
       if (doc){
        res.status(200).json(doc);
       }
       else{
           res.status(404).json({message: "This ID is not Valid"})
       }
   })
   .catch(err => {
       console.log(err)
       res.status(500).json({error: err})
})
});

//delete api for txn

// router.delete('/:txn_id',(req, res, next) => {
//     const id = req.params.txn_id;  
//     console.log(id)
//     Transaction.deleteOne({ _id:id})
//     .exec()
//     .then(result => {

//         console.log(result)
//         if (result.deletedCount != 0){
//         res.status(200).json({
//             message: "Deleted requested entry",
//             id: id
//         })
//         }
//         else{
//             res.status(404).json({
//                 message: "Id doesn't exist"
//             })
//         }
//         })
    
//     .catch(err => {
//         console.log(err)
//         res.status(500).json({
//             error: err
//         })
//     })
// })



//update transaction

router.put('/:txn_id',(req, res, next) => {
    const id = req.params.txn_id;
    const updateOps = {}
    for (const key of Object.keys(req.body)) {
    updateOps[key] = req.body[key]
    }
    
    // Product.updateOne({_id: id},{ $set: {name: res.body.newName, price: res.body.newPrice}}) //Static approachwhere all should be updated(will not requier above loop)
    Transaction.updateOne({_id: id},{ $set: updateOps})  //Dynamic approach, only the one asked will be updates(will requier above loop)
    .exec()
    .then(result =>{
        
        
        if (result.matchedCount > 0)
        {res.status(200).json({
            message: "Update successful!!!",
            Output: result.acknowledged
        })}
        else{
            res.status(200).json({
                message: "Update unsuccessful!!!",
                Output: "ID doesn't exist",
                modified_data:[{
                    amount: req.body.amount,
                    txn_type: req.body.txn_type,
                    description: req.body.description,
                    bill_date:req.body.bill_date,
                    active : req.body.active
                    
                }]
            })
        }
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router;