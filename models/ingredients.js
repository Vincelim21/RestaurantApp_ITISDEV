const mongoose = require('mongoose')

const IngredientsSchema = new mongoose.Schema({
  ingredientType: {
    type: String,
    required: true
  },
  
  runningUnitValue: {
    type: Number,
    required: false
  }

  /*
  unit_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Unit_ID'
  }
  */

},{collection : 'ingredients'})


module.exports = mongoose.model('Ingredients', IngredientsSchema)
