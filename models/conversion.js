const mongoose = require('mongoose')

const conversionSchema = new mongoose.Schema({
    ingredientName:{
        type:String,
        required:true
    },
    ingredientType:{
        type:String,
        required:true
    },
    fromUnit:{
        type:String,
        required:true
    },
    toUnit:{
        type:String,
        required:true
    },
    base_Multiplier:{
        type:Number,
        required:true
    },
    result:{
        type:Number,
        required:true
    }

})
module.exports = mongoose.model('conversion',conversionSchema)
