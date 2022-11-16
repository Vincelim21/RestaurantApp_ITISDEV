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
  /*unit_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Unit_ID'
  }*/
  unitValue: {
    type: Number,
    required: true
  },
  quantityBought: {
    type: Number,
    required: true
  },
  dateBought: {
    type: Date,
    required: true,
    default: Date.now
  }
},{collection : 'ingredient_order'})


module.exports = mongoose.model('Ingredient_order', Ingredient_orderSchema)