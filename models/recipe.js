const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    recipeID:{
        type:Number,
        required:false
    },
    recipeName:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('recipe', recipeSchema)