const mongoose = require('mongoose')

const recipe_ingredients_chefSchema = new mongoose.Schema({
    recipeID:{
        type:Number,
        required:true
    },

    recipeName:{
        type:String,
        required:true
    },
    
    ingredientID:{
        type:Number,
        required:true
    },

    ingredientName:{
        type:String,
        required:true
    },

    unitValue:{
        type:Number,
        required:true
    },

    unit:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('recipe_ingredients_chef', recipe_ingredients_chefSchema)