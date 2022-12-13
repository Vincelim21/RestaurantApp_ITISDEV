const mongoose = require('mongoose')

const discrepancie_historySchema = new mongoose.Schema({

    dateRecorded:{
        type: String,
        required: true,
    },
    ingredientDiscrepancie:{
        type:Array,
        ingredientID: {
            type: String,
            required: true
        },
        quantityDiff: {
            type: String,
            required: true
        }
    }

})

module.exports = mongoose.model('Discrepancie_history', discrepancie_historySchema)