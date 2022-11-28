const mongoose = require('mongoose')



const discrepancieSchema = new mongoose.Schema({
    countID: {
        type: String,
        required: false
    },
    ingredientID: {
        type: String,
        required: true
    },
    quantityDiff: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Discrepancie', discrepancieSchema)