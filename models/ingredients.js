// What's to be seen here: In Chef's POV, view all the ingredients, their running total, and chosen units (grams, mL, oz, etc)\
// Ex.:
// __INGREDIENT__RUNNING TOT____UNIT__
//  Cheese        1250          grams

const mongoose = require('mongoose')

const ingredientsSchema = new mongoose.Schema({
    ingredientID:{
        type:Number,
        required:true
    },
    
    ingredientType:{
        type:String,
        required:true
    },

    runningTotal:{
        type:Number,
        required:true
    },

    unit:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('ingredients', ingredientsSchema)