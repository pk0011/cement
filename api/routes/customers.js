const express =require('express');
const router = express.Router();
const Customer = require('../models/customer')
const mongoose = require('mongoose');


//Fetching all products

router.get('/',(req, res, next) => {
    Customer.find()
    .select("name balance")
    .exec()
    .then(doc => {
        console.log(doc)
        const response = {
            count : doc.length,
            customer: doc.map(doc => {
                return{
                    name: doc.name,
                    balance: doc.balance,
                    _id : doc._id,
                    
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})



//fetching by ID

router.get('/:customerID',(req, res, next) => {
    const id = req.params.customerID;
   Customer.findById(id)
   .exec()
   .then(doc => {
       console.log("From DB", doc);
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


//create a new entry with POST
router.post('/',(req, res, next) => {
    
    const customer = new Customer({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        address: req.body.address,
        mobile: req.body.mobile,
        s_mobile:req.body.s_mobile,
        balance: req.body.balance
    })
    console.log(req.body)
    customer.save().then(result => {
        console.log(result);
        res.status(200).json({
            success: true,
            message: "signup success",
            data:{
                id : customer._id,
                number: customer.mobile
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Customer already exists!",
            data: null
        })
    })
})


//delete selected product
router.delete('/:customerID',(req, res, next) => {
    const id = req.params.customerID;  
    console.log(id)
    Customer.deleteOne({ _id:id})
    .exec()
    .then(result => {

        console.log(result)
        if (result.deletedCount != 0){
        res.status(200).json({
            message: "Deleted requested entry",
            id: id
        })
        }
        else{
            res.status(404).json({
                message: "Id doesn't exist"
            })
        }
        })
    
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

//Update product details

router.patch('/:customerID',(req, res, next) => {
    const id = req.params.customerID;
    const updateOps = {}
    console.log(req.body)
    for (const key of Object.keys(req.body)) {
        console.log(key, "hello")
    updateOps[key] = req.body[key]
    }
    
    // Product.updateOne({_id: id},{ $set: {name: res.body.newName, price: res.body.newPrice}}) //Static approachwhere all should be updated(will not requier above loop)
    Customer.updateOne({_id: id},{ $set: updateOps})  //Dynamic approach, only the one asked will be updates(will requier above loop)
    .exec()
    .then(result =>{
        console.log(result)
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
                    name: req.body.name,
                    address: req.body.address,
                    mobile: req.body.mobile,
                    s_mobile:req.body.s_mobile,
                    balance: req.body.balance
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