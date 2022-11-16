const mongoose = require('mongoose')

const manual_countSchema = new mongoose.Schema({
    countID:{
        type:Number,
        required:true
    },
    ingredientTypeID: {
        type: String,
        required: true
    },
    ingredientType: {
        type: String,
        required: true
    },
    totalQuantity: {
        type: Number,
        required: true
    },
    dateCount: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('ManualCount', manual_countSchema)