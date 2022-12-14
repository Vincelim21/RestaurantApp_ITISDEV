const express = require('express')
const IngredientOrderModel = require('../models/ingredient_order')//ingredient_order table
const manualCountModel = require('../models/manual_count')
const discrepancieModel = require('../models/discrepancie')
const spoilageModel = require('../models/spoilage')
const UserDetailsModel = require('../models/user_details')
const CustomerOrderModel = require('../models/customer_order')
const recipeModel = require('../models/recipe')
const ingredientsModel = require('../models/ingredients')
const recipeIngredientsModel = require('../models/recipe_ingredients')
const IngredientsModel = require("../models/ingredients")
const IngredientFirstModel = require("../models/ingredient_first")
const IngredientStockModel = require("../models/ingredient_stock")
const unitModel = require("../models/unit")
const router = express.Router()
const mongoose = require('mongoose')
const { addListener } = require('../models/ingredient_stock')
const customerOrderModel = require('../models/customer_order')
const recipe = require('../models/recipe')
const db = mongoose.connection

router.get('/create_recipe',async (req,res)=>{

    try{
        const getIngredient = await IngredientsModel.find({})
        const getUnit = await unitModel.find({})
        const recipes = new recipeModel() // Create recipe table
        const recipeingredients = new recipeIngredientsModel() // Create recipeingredients table
        const params = { 
            recipename : recipes, // recipename in EJS file: recipename value retrieved
            recipeingredient : recipeingredients,
            recipeunit : getUnit,
            ingredients : getIngredient

        } 
        res.render('recipes/create_recipe',params) // Render EJS with table values

    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

router.post('/create_recipe',async (req,res)=>{//Happens when submitting form of create_recipe EJS

    //SUMMARY:     Create recipe_table with values inputted from EJS

    //SUMMARY:     Create recipe_table with values inputted from EJS

    try{
        const recipeName = new recipeModel({ // Put fields into recipemodel
            recipeName:req.body.recipe_name,
            recipeID:mongoose.Types.ObjectId()//Table value : Inputted Data from EJS
          })
        recipeModel.create(recipeName)

        for(let i=0;i<req.body.ingredient_value.length;i++){
        let recipeingredients = new recipeIngredientsModel({// Put fields into recipemodel
            ingredientID:recipeName.recipeID,
            ingredientType:req.body.ingredient_name[i],
            totalUnitValue:req.body.ingredient_value[i],
            unit:req.body.ingredient_unit[i],
            
          })
          console.log(req.body.ingredient_value)
          recipeIngredientsModel.create(recipeingredients)
        }

        res.redirect('/')

    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})
router.get('/view_recipe',async(req,res)=>{

    var recipe = await recipeModel.find({})
    var recipeIngredients = await recipeIngredientsModel.find({})


    const params = {
        recipe : recipe,
        recipeIngredients : recipeIngredients
    }

    res.render('recipes/view_recipe',params)
})


module.exports = router