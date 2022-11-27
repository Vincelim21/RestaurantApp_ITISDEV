const mongoose = require('mongoose')

const IngredientsSchema = new mongoose.Schema({
  ingredientID: {
    type: String,
    required: false
  },
  ingredientType: {
    type: String,
    required: true
  },
  totalUnitValue: {
    type: Number,
    required: false
  }
},{collection : 'ingredients'})


module.exports = mongoose.model('Ingredients', IngredientsSchema)
