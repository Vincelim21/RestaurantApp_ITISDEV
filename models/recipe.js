const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        required:false // not inputted by the user switched from true 
    },
    recipeName:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('recipe', recipeSchema)