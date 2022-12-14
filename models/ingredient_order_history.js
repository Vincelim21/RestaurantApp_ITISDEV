const mongoose = require('mongoose')

const Ingredient_order_historySchema = new mongoose.Schema({
  dateBought: {
    type: String,
    required: true
  },
  ingredientID: {
    type: String,
    required: false
  }
  
},{collection : 'ingredient_order_history'})


module.exports = mongoose.model('Ingredient_order_history', Ingredient_order_historySchema)