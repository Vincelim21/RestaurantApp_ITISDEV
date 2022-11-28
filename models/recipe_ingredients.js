// What's to be seen here: In Chef's POV, view all the recipes's contents: ingredients, unit value, and unit 
// Ex.:
//  RECIPE NAME: Hotsilog
//  INGREDIENT___UNIT VAL___UNIT_
//  - Hotdog    :   2       piece/s
//  - Egg       :   1       piece/s
//  - Rice      :   1       cup

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipe_ingredientsSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        ref: 'recipe',
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

module.exports = mongoose.model('recipe_ingredients', recipe_ingredientsSchema)