const mongoose = require('mongoose')

const Ingredient_orderSchema = new mongoose.Schema({
  ingredientID: {
    type: String,
    required: true
  },
  ingredientName: {
    type: String,
    required : true
  },
  ingredientType: {
    type: String,
    required: true
  },
  unitValue: {
    type: Number,
    required: true
  },
  quantityBought: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateBought: {
    type: Date,
    required: true,
    default: Date.now
  }
})


module.exports = mongoose.model('Ingredient_order', Ingredient_orderSchema)