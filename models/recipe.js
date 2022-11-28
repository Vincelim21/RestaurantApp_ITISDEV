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
    },
    recipeIngredients:{
        type:Array,
        ingredientType:{
            type: String,
            required:false // change to true if the user can input / select from dropbox. 
        },
    
        unitValue:{
            type: Number,
            required:true
        },
    
        unitID:{
            type: String,
            required:false // change to true if the user can input / select from dropbox. 
        }
    }

})

module.exports = mongoose.model('recipe', recipeSchema)