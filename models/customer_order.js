const mongoose = require('mongoose')

const customer_orderSchema = new mongoose.Schema({
    orderID:{
        type:Number,
        required:true
    },
    menuID:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    dateOrdered:{
        type:Date,
        required:true
    }
})

module.exports = mongoose.model('customer_order', customer_orderSchema)