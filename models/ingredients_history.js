const mongoose = require('mongoose')

const ingredients_HistorySchema = new mongoose.Schema({
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
},{collection : 'ingredients_HistorySchema'})


module.exports = mongoose.model('Ingredients_HistorySchema', ingredients_HistorySchema)