const mongoose = require('mongoose')

const Ingredient_order_historySchema = new mongoose.Schema({
  dateBought: {
    type: String,
    required: true
  },
  ingredientOrder:{
    type:Array,
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

  }
},{collection : 'ingredient_order_history'})


module.exports = mongoose.model('Ingredient_order_history', Ingredient_order_historySchema)