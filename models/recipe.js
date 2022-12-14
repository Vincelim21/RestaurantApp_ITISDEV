const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    recipeID:{
        type:String,
        required:true
    },
    recipeName:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:true,
    }

})

module.exports = mongoose.model('recipe', recipeSchema)