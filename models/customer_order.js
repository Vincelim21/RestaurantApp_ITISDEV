const mongoose = require('mongoose')

const customer_orderSchema = new mongoose.Schema({
    orderID: {
        type: Number,
        required: false
    },
    orders: {
        type: Array,
        itemName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    },
    dateOrdered: {
        type: Date,
        required: false,
        default: Date.now
    }
})

module.exports = mongoose.model('customer_order', customer_orderSchema)