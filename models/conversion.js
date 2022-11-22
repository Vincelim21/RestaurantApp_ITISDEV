const mongoose = require('mongoose')

const conversionSchema = new mongoose.Schema({
    unitID:{
        type:Number,
        required:true
    },
    toUnit:{
        type:String,
        required:true
    },
    base_Multiplier:{
        type:Number,
        required:true
    }
    
})
module.exports = mongoose.model('conversion',conversionSchema)
