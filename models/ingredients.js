const mongoose = require('mongoose')

const IngredientsSchema = new mongoose.Schema({
  ingredientID: {
    type: String,
    required: true
  },
  ingredientType: {
    type: String,
    required: true
  },
  totalUnitValue: {
    type: Number,
    required: true
  }
},{collection : 'ingredients'})


module.exports = mongoose.model('Ingredients', IngredientsSchema)
