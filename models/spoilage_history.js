const mongoose = require('mongoose')

const spoilage_historySchema = new mongoose.Schema({
    dateSpoiled:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Spoilage_history',spoilage_historySchema)