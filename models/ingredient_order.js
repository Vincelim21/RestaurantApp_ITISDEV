const mongoose = require('mongoose')

const Ingredient_orderSchema = new mongoose.Schema({
  ingredientID: {
    type: String,
    required: false
  },
  ingredientName: {
    type: String,
    required : true
  },
  ingredientType: {
    type: String,
    required: false
  },
  unit: {
    type: String,
    required: false
 
  },
  unitValue: {
    type: Number,
    required: false
  },
  quantityBought: {
    type: Number,
    required: false
  },
  dateBought: {
    type: String,
    required: true
  }
},{collection : 'ingredient_order'})


module.exports = mongoose.model('Ingredient_order', Ingredient_orderSchema)