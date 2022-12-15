const mongoose = require('mongoose')

const daily_UsageSchema = new mongoose.Schema({
    dailyUsageID:{
        type:String,
        required:true,
    },
    date: {
        type: String,
        required: false,
    }
})

module.exports = mongoose.model('daily_usage', daily_UsageSchema)