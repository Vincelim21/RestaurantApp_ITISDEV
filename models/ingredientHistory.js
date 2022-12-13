const mongoose = require('mongoose')

const ingredient_HistorySchema = new mongoose.Schema({
  dateBought: {
    type: String,
    required: true
  },
  ingredientslist: {
    type: Array,
    ingredientType: {
        type: String,
        required: true
    }, 
    totalUnitValue: {
        type: Number,
        required: false
    },
    unit: {
        type: String,
        required:true
    }
  }
},{collection : 'ingredient_HistorySchema'})


module.exports = mongoose.model('Ingredient_HistorySchema', ingredient_HistorySchema)