const mongoose = require('mongoose')

const IngredientsSchema = new mongoose.Schema({
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

},{collection : 'ingredients'})


module.exports = mongoose.model('Ingredients', IngredientsSchema)
