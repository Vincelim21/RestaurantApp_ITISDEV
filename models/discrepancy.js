const mongoose = require('mongoose')



const discrepancySchema = new mongoose.Schema({
    ingredientID: {
        type: String,
        required: true
    },
    ingredientName: {
        type:String,
        required: true
    },
    quantityDiff: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Discrepancy', discrepancySchema)