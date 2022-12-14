// What's to be seen here: In Chef's POV, view all the recipes's contents: ingredients, unit value, and unit 
// Ex.:
//  RECIPE NAME: Hotsilog
//  INGREDIENT___UNIT VAL___UNIT_
//  - Hotdog    :   2       piece/s
//  - Egg       :   1       piece/s
//  - Rice      :   1       cup

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipe_ingredientsSchema = new Schema({
    ingredientID:{
        type:String,
        required:true
    },
    ingredientType: {
        type: String,
        required: true
      },
    
      totalUnitValue: {
        type: Number,
        required: false
      },
      unit:{
        type: String,
        required:true
      }
})

module.exports = mongoose.model('recipe_ingredients', recipe_ingredientsSchema)
