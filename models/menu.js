const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    menuID:{
        type:Number,
        required:true
    },
    itemName:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('menu', menuSchema)