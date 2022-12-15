const mongoose = require('mongoose')

const discrepancy_historySchema = new mongoose.Schema({

    dateRecorded:{
        type: String,
        required: true,
    },
    ingredientID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Discrepancy_history', discrepancy_historySchema)