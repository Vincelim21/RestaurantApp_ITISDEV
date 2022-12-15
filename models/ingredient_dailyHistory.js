const mongoose = require('mongoose')

const ingredient_dailyHistorySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
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
},{collection : 'ingredient_dailyHistory'})


module.exports = mongoose.model('Ingredient_dailyHistory', ingredient_dailyHistorySchema)