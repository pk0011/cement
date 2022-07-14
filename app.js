const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');

//new code start
const mongoose = require("mongoose");


const URI = "mongodb+srv://1234:1234@cluster0.pwuj2.mongodb.net/?retryWrites=true&w=majority";
// const URI="mongodb://localhost:27017/student";
console.log(URI)
mongoose.connect(URI, {

useNewUrlParser: true, 

useUnifiedTopology: true 

}, err => {
if(err) throw err;
console.log('Connected to MongoDB!!!')
});
//new code ends

app.use(morgan('dev'));
app.use(multer().array());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req,res, next)=>{
    res.header('Access-Control-Allow-Origin', '*'),
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Access, Authorization' )
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Method', 'POST, PUT, GET, PATCH, DELETE');
        return res.status(200).json({})
    }
    next();
});

const customerRoutes = require('./api/routes/customers');
const transactionRoutes = require('./api/routes/transactions');
// const imageRoutes = require('./api/routes/images');


// const { translateAliases } = require('./api/models/customer');



app.use('/customers', customerRoutes);
app.use('/transactions',transactionRoutes);
// app.use('/images',imageRoutes)





app.use((req,res,next)=>{
    const error = new Error("Not found any");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    res.json({
        message: error.message
    })

})
module.exports = app;