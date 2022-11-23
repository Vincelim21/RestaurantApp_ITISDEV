const mongoose = require('mongoose')

const Ingredient_firstSchema = new mongoose.Schema({
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
  }
},{collection : 'ingredient_first'})


module.exports = mongoose.model('Ingredient_first', Ingredient_firstSchema)