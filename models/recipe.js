const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    recipeID:{
        type:Number,
        required:true
    },
    recipeName:{
        type:String,
        required:true
    },
    menuID:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('recipe', recipeSchema)