const mongoose = require('mongoose')



const discrepancieSchema = new mongoose.Schema({
    countID: {
        type: Number,
        required: true
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

module.exports = mongoose.model('Discrepancie', discrepancieSchema)