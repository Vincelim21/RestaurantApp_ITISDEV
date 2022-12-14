
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderID:{
        type:String,
        required:true
    },
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
    
})

module.exports = mongoose.model('order', orderSchema)