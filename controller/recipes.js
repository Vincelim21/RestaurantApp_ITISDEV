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
const db = mongoose.connection

router.get('/create_recipe',async (req,res)=>{

    try{
        const getRecipeIngredient = await IngredientsModel.find({})
        const getUnit = await unitModel.find({})
        const recipes = new recipeModel() // Create recipe table
        const recipeingredients = new recipeIngredientsModel() // Create recipeingredients table
        const params = { 
            recipename : recipes, // recipename in EJS file: recipename value retrieved
            recipeingredient : getRecipeIngredient,
            recipeunit : getUnit

        } 
        res.render('recipes/create_recipe',params) // Render EJS with table values

    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

router.post('/create_recipe',async (req,res)=>{//Happens when submitting form of create_recipe EJS

    //SUMMARY:     Create recipe_table with values inputted from EJS

    try{

        let arrayofrecipes = [];

        for(let i=0;i<req.body.ingredient_value.length;i++){
        let recipeingredients = new recipeIngredientsModel({ // Put fields into recipemodel
            unitValue:req.body.ingredient_value[i], //Table value : Inputted Data from EJS 
            ingredientType:req.body.ingredient_name[i],
            unitID:req.body.ingredient_unit[i]

          })
          arrayofrecipes.push(recipeingredients)
        }
          

          const recipeName = new recipeModel({ // Put fields into recipemodel
            recipeName:req.body.recipe_name,
            recipeIngredients:arrayofrecipes //Table value : Inputted Data from EJS     
          })
        recipeModel.create(recipeName) // Create table in MongoAtlas
        // recipeIngredientsModel.create(arrayofrecipes) // Create table in MongoAtlas
        console.log(recipeName)
        res.redirect('/')
          
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})
router.get('/view_recipe',async(req,res)=>{

    const recipe = await recipeModel.find({})

    try{
        //Read Database file
        //Retrieve recipeIngredients table
        res.render('recipes/view_recipe',{recipe:recipe});
        //EJS
    }catch(error){
        res.status(500).send(error);
        console.log(error)
    }
})


module.exports = router