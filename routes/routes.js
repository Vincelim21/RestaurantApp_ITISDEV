const express = require('express')
const IngredientOrderModel = require('../models/ingredient_order')//ingredient_order table
const manualCountModel = require('../models/manual_count')
const discrepancieModel = require('../models/discrepancie')
const spoilageModel = require('../models/spoilage')
const UserDetailsModel = require('../models/user_details')
const CustomerOrderModel = require('../models/customer_order')
const menuModel = require('../models/menu')
const recipeModel = require('../models/recipe')
const IngredientsModel = require("../models/ingredients")
const IngredientFirstModel = require("../models/ingredient_first")
const IngredientStockModel = require("../models/ingredient_stock")
const router = express.Router()
const mongoose = require('mongoose')
const db = mongoose.connection


// First time use
router.get('/', async(req,res) =>{
    res.render('login')
})


router.get('/record_firsttime',async(req,res) =>{ //Happens when rendering record_firsttime EJS

    //SUMMARY: Render EJS file with IngredientsFirst Table (created) and Ingredients Table (Retrieved) as params for EJS
    
    try{
        const ingredients = await IngredientsModel.find({})  //Retrieve Ingredients table
        const ingredient_first = new IngredientFirstModel() // Create Ingredients Firsttime table
        const params = {
            ingredients: ingredients, // ingredients in EJS file: ingredients data taken  
            ingredientorder : ingredient_first // ingredientorder in EJS file: ingredientfirst value retrieved
        } 
        res.render('record_firsttime',params) // Render EJS with table values
        
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
        res.render('record_itempurchase',params) // Render EJS with table values
        
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

// only manage to make recipeName work
router.get('/create_recipe',async (req,res)=>{

    try{
        const recipes = new recipeModel() // Create recipe Firsttime table
        const params = { 
            recipename : recipes // recipename in EJS file: recipename value retrieved
        } 
        res.render('create_recipe',params) // Render EJS with table values

    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})
// only manage to make recipeName work
router.post('/create_recipe',async (req,res)=>{//Happens when submitting form of create_recipe EJS

    //SUMMARY:     Create recipe_table with values inputted from EJS

    try{
        const recipeName = new recipeModel({ // Put fields into recipemodel
            recipeName:req.body.recipe_name, //Table value : Inputted Data from EJS     
          })
 
        recipeModel.create(recipeName) // Create table in MongoAtlas
        res.redirect('/')

    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})


router.get('/view_inventory-controller',async(req,res) =>{
    
    const ingredientStock = await IngredientStockModel.find({})

    try{
        // Read Databasefile
          //Retrieve IngredientStock table
        res.render('view_inventory-controller',{ingredStock:ingredientStock});
    //EJS 
        
    }catch(error){
        res.status(500).send(error);
        console.log(error);
    }
})

router.get('/record_physical',async(req,res) =>{
    
    try{
        // Read Databasefile
        const ingredientStock = await IngredientStockModel.find({});  //Retrieve IngredientStock table
        res.render('record_physical',{ingredStock:ingredientStock});
    //EJS 
        
    }catch(error){
        res.status(500).send(error);
        console.log(error);
    }
})

//I stopped here
router.post('/record_physical',async (req,res)=>{
    try{
        const ingredientDiscrepancie = new discrepancieModel({  // Put fields into Ingredient First Model
            ingredientID: req.body.ingredientID,
            quantityDiff:req.body.unitValue
          })
 
    
        IngredientFirstModel.create(ingredientFirst) 
        res.redirect('/')
        

    }catch(error){
        res.status(500).send(error)
    }
    
})

//Test to see if data in discrepancies are being read properly
router.get('/test_discrepancies',async (req,res) =>{
    
    const Discrepancies = await discrepancieModel.find({});
    
    try{
        res.render('test_discrepancies',{discrep:Discrepancies})
        console.log(Discrepancies) //check lang
    }catch(error){
        res.status(500).send(error)
    }   

})

router.get('/test_userDetails',async (req,res) =>{ //TEST DATA HERE (can be accessed in home page)
    
    const userdetails = await UserDetailsModel.findOne({userID: "9901"})
    
    try{
        res.render('test_userDetails',{userdetails /* nakalagay na "ingredient" sa ejs (loob ng <%=)*/:userdetails})
        console.log(userdetails) //check lang
    }catch(error){
        res.status(500).send(error)
    }

})

router.get('/create_ingredient',async (req,res) => {

    
})

//Home Page
router.get('/home_stockctrl',(req,res) =>{
    //First Screen
    res.render('home_stockctrl')
})

router.get('/home_chef',(req,res) =>{
    //First Screen
    res.render('home_chef')
})

router.get('/home_manager',(req,res) =>{
    res.render('home_manager')
})

//Create Page
router.get('/create_ingredient',(req,res) =>{
    //First Screen
    res.render('create_ingredient')
})
router.get('/create_recipe',(req,res) =>{
    //First Screen
    res.render('create_recipe')
})

//Record Page

router.get('/record_spoiled',(req,res) =>{
    //First Screen
    res.render('record_spoiled')
})

//View Pages
router.get('/view_inventory-controller',(req,res) =>{
    //First Screen
    res.render('view_inventory-controller')
})
router.get('/view_inventorypurchases',(req,res) =>{
    //First Screen
    res.render('view_inventorypurchases')
})
router.get('/view_recipe',(req,res) =>{
    //First Screen
    res.render('view_recipe')
})
router.get('/view_inventory-chef',(req,res) =>{
    //First Screen
    res.render('view_inventory-chef')
})


router.get('/cashier_menu',(req,res) =>{
    res.render('cashier_menu')
})

router.get('/record_physical',(req,res) =>{
    res.render('record_physical')
})

// export router to server.js
module.exports = router