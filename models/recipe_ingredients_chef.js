// What's to be seen here: In Chef's POV, view all the recipes's contents: ingredients, unit value, and unit 
// Ex.:
//  RECIPE NAME: Hotsilog
//  __INGREDIENT___UNIT VAL___UNIT___
//  - Hotdog    :   2       piece/s
//  - Egg       :   1       piece/s
//  - Rice      :   1       cup

const mongoose = require('mongoose')

const recipe_ingredients_chefSchema = new mongoose.Schema({
    recipeID:{
        type:Number,
        required:true
    },
    
    ingredientType:{
        type:String,
        required:true
    },

    unitValue:{
        type:Number,
        required:true
    },

    unitID:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('recipe_ingredients_chef', recipe_ingredients_chefSchema)