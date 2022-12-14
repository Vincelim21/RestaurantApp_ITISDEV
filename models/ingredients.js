const mongoose = require('mongoose')

const IngredientsSchema = new mongoose.Schema({
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
    required: false,
    default: 0
  },

  unit:{
    type: String,
    required:true
  }

},{collection : 'ingredients'})


module.exports = mongoose.model('Ingredients', IngredientsSchema)
