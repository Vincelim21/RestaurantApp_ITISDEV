const mongoose = require('mongoose')

const customer_orderSchema = new mongoose.Schema({
    customerID:{
        type:String,
        required:true,
    },
    dateOrdered: {
        type: Date,
        required: false,
        default: Date.now
    }
})

module.exports = mongoose.model('customer_order', customer_orderSchema)