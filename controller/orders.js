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

router.get('/record_firsttime',async(req,res) =>{ //Happens when rendering record_firsttime EJS

    //SUMMARY: Render EJS file with IngredientsFirst Table (created) and Ingredients Table (Retrieved) as params for EJS
    
    try{
        const ingredients = await IngredientsModel.find({})  //Retrieve Ingredients table
        const unit = await unitModel.find({})
        const ingredient_first = new IngredientFirstModel() // Create Ingredients Firsttime table
        const params = {
            ingredients: ingredients, // ingredients in EJS file: ingredients data taken  
            ingredientorder : ingredient_first,
            unit: unit // ingredientorder in EJS file: ingredientfirst value retrieved
        } 
        res.render('orders/record_firsttime',params) // Render EJS with table values
        
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }

    
})
router.post('/record_firsttime',async (req,res)=>{//Happens when submitting form of record_firsttime EJS

    //SUMMARY:     Create IngredientFirst table with values inputted from EJS

    try{
        const ingredientFirst = new IngredientFirstModel({ // Put fields into Ingredient First Model
            ingredientName:req.body.name, //Table value : Inputted Data from EJS
            unitValue:req.body.unitValue,
            ingredientType: req.body.ingredientType
            
          })
 
    
        IngredientFirstModel.create(ingredientFirst) // Create table in MongoAtlas
        res.redirect('/')
        

    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
    
})

router.get('/record_itempurchase',async (req,res)=>{

    //SUMMARY: Render EJS file with IngredientOrder Table (created) and IngredientsFirst Table (Retrieved) as params for EJS


    try{
        const ingredientFirst = await IngredientFirstModel.find({}) //Get INgredients First Table
        console.log(ingredientFirst)
        const ingredientOrder = new IngredientOrderModel() // Create Ingredient Order table

        const params = {
            ingredientorder: ingredientOrder, // ingredientorder in EJS file: Ingredient Order value taker
            ingredientfirst : ingredientFirst// ingredientfirst in EJS file: Ingredient First value taken
        } // EJS
        res.render('orders/record_itempurchase',params) // Render EJS with table values
        
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }


})

router.post('/record_itempurchase',async (req,res)=>{

     //SUMMARY: Create IngredientsOrder Table with IngredientsFirst values and inputted values, Update Ingredients table with Ingredients Order value, Update Ingredient Stock table with Ingredients Order Value (create if not existing)


    try{
       const ingredientFirst = await IngredientFirstModel.findOne({ingredientName:req.body.name}) //Get Ingredient First Table Values to be put in for Ingredient Order Values


       const ingredientOrder = new IngredientOrderModel({ //Create Ingredient Order Values
        ingredientName:ingredientFirst.ingredientName, // Put Ingredient First Values in Ingredient Order Table
        ingredientType:ingredientFirst.ingredientType,
        unitValue:ingredientFirst.unitValue,
        quantityBought:req.body.quantity // Put Inputted Value into Ingredient Order Table
       })
       
       IngredientOrderModel.create(ingredientOrder)  // Create Ingredient Order Table
 

       var query = {ingredientType:ingredientOrder.ingredientType} // Find Ingredient Type of Ingredients Table with a similar Ingredient type of IngredientOrder table
       var valueQuery = ingredientOrder.quantityBought * ingredientOrder.unitValue // UnitValue * Quantity of Ingredient Order (totalUnitValue of IngredientOrder)
       
       IngredientsModel.updateOne(
            { ingredientType: ingredientOrder.ingredientType },
            { $inc: { totalUnitValue: Number(valueQuery) }}
         ).exec() // Update IngredientModel table by adding valueQuery of Ingredient Order to totalUnitValue of IngredientsModel
       
       
       const ingredientStockQuery = await IngredientStockModel.findOne({ingredientName:ingredientOrder.ingredientName}) // Find IngredientStock Table with Name to IngredientOrder name



       if ( ingredientStockQuery== null){ //If there are no IngredientStock Table with existing name that was ordered
        const ingredientStock = new IngredientStockModel({ //Create IngredientStock Table with values from IngredientFirst and valueQuery
            ingredientName:ingredientFirst.ingredientName,
            ingredientType:ingredientFirst.ingredientType,
            totalUnitValue: valueQuery
        }) 
        IngredientStockModel.create(ingredientStock) //Create IngredientStock Table
        res.redirect('/')
       }

       else{ //If there is an existing IngredientStock Table that was ordered

        IngredientStockModel.updateOne(
            { ingredientName: ingredientOrder.ingredientName },
            { $inc: { totalUnitValue: Number(valueQuery) }}
         ).exec() //Update IngredientStock table by finding the table with the same IngredientOrder name and incrementing totalUnitValue with valQuery
        res.redirect('/')
       }


    }catch(error){
        res.status(500).send(error)
    }
    
})
module.exports = router