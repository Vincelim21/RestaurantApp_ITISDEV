const mongoose = require('mongoose')

const manual_countSchema = new mongoose.Schema({
    countID:{
        type:Number,
        required:true
    },
    ingredientTypeID: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    totalUnitValue: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('manual_Count', manual_countSchema)