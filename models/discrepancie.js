const mongoose = require('mongoose')

const discrepancieSchema = new mongoose.Schema({
    ingredientID: {
        type: Number,
        required: true
    },
    difference: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Discrepancies', discrepancieSchema)