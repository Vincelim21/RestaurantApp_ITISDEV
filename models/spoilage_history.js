const mongoose = require('mongoose')

const spoilage_historySchema = new mongoose.Schema({

    ingredientSpoiled:{
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
    }
})

module.exports = mongoose.model('Spoilage_history',spoilage_historySchema)