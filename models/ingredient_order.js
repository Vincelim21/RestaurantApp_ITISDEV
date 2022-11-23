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
  /*unit_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Unit_ID'
  }*/
  unitValue: {
    type: Number,
    required: false
  },
  quantityBought: {
    type: Number,
    required: false
  },
  dateBought: {
    type: Date,
    required: true,
    default: Date.now
  }
},{collection : 'ingredient_order'})


module.exports = mongoose.model('Ingredient_order', Ingredient_orderSchema)