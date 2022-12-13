const mongoose = require('mongoose')

const ingredient_dailyHistorySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },

  ingredient:{
    type:Array,

    ingredientType: {
      type: String,
      required: false
    },

    totalUnitValue: {
        type: Number,
        required: false
    },

    unit: {
      type: String,
      required: false
    }
  }
},{collection : 'ingredient_order_history'})


module.exports = mongoose.model('Ingredient_dailyHistory', ingredient_dailyHistorySchema)