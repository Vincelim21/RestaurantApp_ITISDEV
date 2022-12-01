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

  unitID:{
    type: String,
    required:false // change to true if the user can input / select from dropbox. 
  }

},{collection : 'ingredients'})


module.exports = mongoose.model('Ingredients', IngredientsSchema)
