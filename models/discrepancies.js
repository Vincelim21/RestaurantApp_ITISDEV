const mongoose = require('mongoose')

const discrepanciesSchema = new mongoose.Schema({
    countID:{
        type:Number,
        required:true
    },
    ingredientID: {
        type: Number,
        required: true
    },
    quantityDiff: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('discrepancies', discrepanciesSchema)