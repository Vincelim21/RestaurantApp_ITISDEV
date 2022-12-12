const mongoose = require('mongoose')

const unitSchema = new mongoose.Schema({
    unitID:{
        type:Number,
        required:true
    },
    unitName:{
        type:String,
        required:true
    },
    unitSign:{
        type:String,
        required:false
    }
})
module.exports = mongoose.model('unit',unitSchema)
