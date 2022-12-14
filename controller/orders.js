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
const conversionModel = require('../models/conversion')
const ingredientOrderHistoryModel = require('../models/ingredient_order_history')
var parsedate = require('datejs')
const { find } = require('../models/ingredient_order_history')
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
            ingredientType: req.body.ingredientType,
            unit: req.body.unit
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
        console.log(ingredientFirst)
        const history = await ingredientOrderHistoryModel.findOne({dateBought:Date.today().addDays(-2).toString("MMMM dS, yyyy")})
        console.log(history + "HISTORY ETO  ")
        
        if(history ==null){
            const ingredientOrderHistory = new ingredientOrderHistoryModel({
                ingredientID:mongoose.Types.ObjectId(),//Create Ingredient Order Values
                dateBought: Date.today().addDays(-2).toString("MMMM dS, yyyy")
                })
                ingredientOrderHistoryModel.create(ingredientOrderHistory)

                
        }
        console.log("HEREEEE: ")
        const ingredientOrderHistory = await ingredientOrderHistoryModel.findOne({dateBought:Date.today().addDays(-2).toString("MMMM dS, yyyy")})


    
       const ingredientOrder = new IngredientOrderModel({ 
        ingredientID:ingredientOrderHistory.ingredientID,//Create Ingredient Order Values
        ingredientName:ingredientFirst.ingredientName, // Put Ingredient First Values in Ingredient Order Table
        ingredientType:ingredientFirst.ingredientType,
        unitValue:ingredientFirst.unitValue,
        quantityBought:req.body.quantity,
        unit: ingredientFirst.unit,
        dateBought: Date.today().addDays(-2).toString("MMMM dS, yyyy")
        
       })
      
       IngredientOrderModel.create(ingredientOrder)  // Create Ingredient Order Table
       console.log("HEREEEE: ")
       const ingredient = await IngredientsModel.findOne({ingredientType: ingredientOrder.ingredientType})
       console.log("ingredient :  "+ ingredient)
       try{
        var convertedValue = Number(conversion(ingredientOrder,ingredient))
       }catch(error){
        console.log(error)
       }
       
       console.log("Converted Value: "+convertedValue)

       IngredientsModel.updateOne(
            { ingredientType: ingredientOrder.ingredientType },
            { $inc: { totalUnitValue: convertedValue }}
         ).exec() // Update IngredientModel table by adding valueQuery of Ingredient Order to totalUnitValue of IngredientsModel
       
       
       const ingredientStockQuery = await IngredientStockModel.findOne({ingredientName:ingredientOrder.ingredientName}) // Find IngredientStock Table with Name to IngredientOrder name
       console.log(ingredientStockQuery)
       var valueQuery = ingredientOrder.quantityBought * ingredientOrder.unitValue
       console.log("Value query: "+valueQuery)


       //Create or Update Order History

       
       

       


       if ( ingredientStockQuery== null){ //If there are no IngredientStock Table with existing name that was ordered
        const ingredientStock = new IngredientStockModel({ //Create IngredientStock Table with values from IngredientFirst and valueQuery
            ingredientName:ingredientFirst.ingredientName,
            ingredientType:ingredientFirst.ingredientType,
            totalUnitValue: Number(valueQuery),
            unit: ingredientFirst.unit
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

function conversion(ingredientOrder,ingredient){
    console.log( ingredientOrder.unit + ingredient.unit)
    var orderedValue = ingredientOrder.quantityBought * ingredientOrder.unitValue
    if(ingredientOrder.unit != ingredient.unit){

        var multiplier = getMultiplier(ingredientOrder.unit,ingredient.unit)
        console.log( ingredientOrder.unit + ingredient.unit)
        console.log("MULTIPLIER HERE: " +multiplier)

        var conversion = new conversionModel({
            ingredientName:ingredientOrder.ingredientName,
            ingredientType: ingredientOrder.ingredientType,
            fromUnit: ingredientOrder.unit,
            toUnit :ingredient.unit,
            base_Multiplier :Number(multiplier),
            result :Number(multiplier*orderedValue)
        })
        conversionModel.create(conversion)
        return orderedValue*multiplier


    }
    else 
        return orderedValue
}

function getMultiplier(ingredientOrderUnit,ingredientUnit) // Params: from unit,to unit Returns multiplier
{

    var multiplier = 0
    if(ingredientOrderUnit == "gram"){
        switch(ingredientUnit){
            case "kilogram": multiplier = 0.001; break;
            case "milliliter" :multiplier = 1; break;
            case "liter" : multiplier = 1000; break;
            case "gallon" : multiplier =  0.000264172052; break;
            case "ounce" : multiplier = 0.035274; break;
            case "pound": multiplier = 0.00220462; break;
            case "milligram": multiplier = 1000; break;
        } 
    }
    else if(ingredientOrderUnit == "kilogram"){
        switch(ingredientUnit){
            case "gram": multiplier = 1000; break;
            case "milliliter" :multiplier = 1000; break;
            case "liter" : multiplier = 1; break;
            case "gallon" : multiplier = 3.79; break;
            case "ounce" : multiplier = 35.274; break;
            case "pound": multiplier = 2.20462; break;
            case "milligram": multiplier = 1000000; break;
        } 
    }
    else if (ingredientOrderUnit == "milliliter"){
        switch(ingredientUnit){
            case "gram": multiplier = 1; break;
            case "kilogram" :multiplier = 1000; break;
            case "liter" : multiplier = 0.001; break;
            case "gallon" : multiplier = 0.000264; break;
            case "ounce" : multiplier = 0.034; break;
            case "pound": multiplier = 0.0022; break;
            case "milligram": multiplier = 1000; break;
        } 
    }
    else if (ingredientOrderUnit == "liter"){
        switch(ingredientUnit){
            case "gram": multiplier = 1000; break;
            case "kilogram" :multiplier = 1; break;
            case "milliliter" : multiplier = 1000; break;
            case "gallon" : multiplier = 0.264; break;
            case "ounce" : multiplier = 33.814; break;
            case "pound": multiplier = 2.2; break;
            case "milligram": multiplier = 1000000; break;
        } 
    }
    else if (ingredientOrderUnit == "gallon"){
        switch(ingredientUnit){
            case "gram": multiplier = 3,785.41      ; break;
            case "kilogram" :multiplier = 3.785412; break;
            case "milliliter" : multiplier = 3785.41; break;
            case "liter" : multiplier = 3.78541; break;
            case "ounce" : multiplier = 128; break;
            case "pound": multiplier = 8.34; break;
            case "milligram": multiplier = 3,785,411.78; break;
        } 
    }
    else if (ingredientOrderUnit == "ounce"){
        switch(ingredientUnit){
            case "gram": multiplier = 28.35    ; break;
            case "kilogram" :multiplier = 0.028; break;
            case "milliliter" : multiplier = 29.57; break;
            case "liter" : multiplier = 0.0295; break;
            case "gallon" : multiplier = 0.0078; break;
            case "pound": multiplier = 0.0625; break;
            case "milligram": multiplier = 28349.5; break;
        } 
    }
    else if (ingredientOrderUnit == "pound"){
        switch(ingredientUnit){
            case "gram": multiplier = 453.59; break;
            case "kilogram" :multiplier = 0.454; break;
            case "milliliter" : multiplier = 453.59; break;
            case "liter" : multiplier = 0.45; break;
            case "gallon" : multiplier = 8.34; break;
            case "ounce": multiplier = 16; break;
            case "milligram": multiplier = 453592; break;
        } 
    }
    else if (ingredientOrderUnit == "milligram"){
        switch(ingredientUnit){
            case "gram": multiplier = 0.001; break;
            case "kilogram" :multiplier = 0.000001; break;
            case "milliliter" : multiplier = 0.001; break;
            case "liter" : multiplier = 0.000001; break;
            case "gallon" : multiplier = 3785.41; break;
            case "ounce": multiplier = 0.000035; break;
            case "pound": multiplier = 0.0000022; break;
        } 
    }
    else 
        return null
    console.log("MULTIPLIER FROM CONVERSION FUNCTION: "+multiplier)

    return multiplier
}



module.exports = router