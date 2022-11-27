// What's to be seen here: In Chef's POV, view all the recipes's contents: ingredients, unit value, and unit 
// Ex.:
//  RECIPE NAME: Hotsilog
//  __INGREDIENT___UNIT VAL___UNIT___
//  - Hotdog    :   2       piece/s
//  - Egg       :   1       piece/s
//  - Rice      :   1       cup

const mongoose = require('mongoose')

const recipe_ingredientsSchema = new mongoose.Schema({
    recipeID:{
        type:Number,
        required:false // change to true if the user can input / select from dropbox. 
    },
    
    ingredientType:{
        type:String,
        required:false // change to true if the user can input / select from dropbox. 
    },

    unitValue:{
        type:Number,
        required:true
    },

    unitID:{
        type:Number,
        required:false // change to true if the user can input / select from dropbox. 
    }
})

module.exports = mongoose.model('recipe_ingredients', recipe_ingredientsSchema)