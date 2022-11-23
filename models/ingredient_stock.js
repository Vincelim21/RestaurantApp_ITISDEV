const mongoose = require('mongoose')

const Ingredient_stockSchema = new mongoose.Schema({
  ingredientID: {
    type: String,
    required: true
  },
  ingredientName: {
    type: String,
    required : true
  },
  ingredientType: {
    type: String,
    required: true
  },
  totalUnitValue: {
    type: Number,
    required: true
  }
},{collection : 'ingredient_stock'})


module.exports = mongoose.model('Ingredient_stock', Ingredient_stockSchema)