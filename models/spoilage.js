const mongoose = require('mongoose')

const spoilageSchema = new mongoose.Schema({
    ingredientID: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    dateSpoiled: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Spoilage', spoilageSchema)