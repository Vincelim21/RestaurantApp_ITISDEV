const mongoose = require('mongoose')

const unitSchema = new mongoose.Schema({
    unitID:{
        type:Number,
        required:true
    },
    unitName:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('unit',unitSchema)
