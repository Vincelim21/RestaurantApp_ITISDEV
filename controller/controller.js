const express = require('express')
const IngredientOrderModel = require('../models/ingredient_order')//ingredient_order table
const manualCountModel = require('../models/manual_count')
const discrepancyModel = require('../models/discrepancy')
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


// First time use
router.get('/', async(req,res) =>{
    res.render('login')
})


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
        res.render('create_recipe',params) // Render EJS with table values

    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

router.post('/create_recipe',async (req,res)=>{//Happens when submitting form of create_recipe EJS

    //SUMMARY:     Create recipe_table with values inputted from EJS

    try{
        
        const recipeingredients = new recipeIngredientsModel({ // Put fields into recipemodel
            unitValue:req.body.ingredient_value, //Table value : Inputted Data from EJS 
            ingredientType:req.body.ingredient_name,
            unitID:req.body.ingredient_unit
          })

          console.log(recipeingredients)

          const recipeName = new recipeModel({ // Put fields into recipemodel
            recipeName:req.body.recipe_name,
            recipeIngredients:recipeingredients //Table value : Inputted Data from EJS     
          })
        recipeModel.create(recipeName) // Create table in MongoAtlas
        recipeIngredientsModel.create(recipeingredients) // Create table in MongoAtlas
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
//Renders current inventory and stock amount in record physical page
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

//Submits user manual count input and calculates the difference of system inventory with the manual count
router.post('/record_physical',async (req,res)=>{

    try{
        const ingredientStockChosen = await IngredientStockModel.findOne({ingredientName:req.body.ingredient_names})

       var quantityDiff = req.body.fname - ingredientStockChosen.totalUnitValue  

        const ingredientDiscrepancy = new discrepancyModel({  // Put fields into Ingredient First Model
            ingredientID: req.body.ingredient_names,
            quantityDiff:quantityDiff
          })
 
    
        discrepancyModel.create(ingredientDiscrepancy) 
        console.log(quantityDiff)
        
        IngredientStockModel.updateOne({ingredientName:req.body.ingredient_names},
            {$inc: { totalUnitValue: Number(quantityDiff)}}
            ).exec()

        res.redirect('/')

    }catch(error){
        res.status(500).send(error)
        console.log(error);
    }
    
})
//Renders the page to view discprepancy
router.get('/view_discrepancy',async(req,res)=>{

    try{
        const getViewDiscrepancy = await discrepancyModel.find({});
        const getStockValue = await IngredientStockModel.find({});
        const params = { 
            discrep : getViewDiscrepancy // recipename in EJS file: recipename value retrieved
        } 
        console.log(getViewDiscrepancy);
        console.log(getStockValue);

        res.render('view_discrepancy',params);
        }catch(error){
            res.status(500).send(error)
        }
    
})

router.get('/record_spoiled',async(req,res) =>{
    
    try{
        // Read Databasefile
        const ingredientStock = await IngredientStockModel.find({});  //Retrieve IngredientStock table
        res.render('record_spoiled',{ingredientStock:ingredientStock});
    //EJS 
        
    }catch(error){
        res.status(500).send(error);
        console.log(error);
    }
})

router.post('/record_spoiled',async (req,res)=>{

    try{
    
       var quantitySpoiled = req.body.spoiled_quantity

        const ingredientSpoiled= new spoilageModel({  // Put fields into Ingredient First Model
            ingredientTypeID: req.body.ingredient_names,
            quantity:quantitySpoiled
          })
 
    
        spoilageModel.create(ingredientSpoiled) 
        console.log(quantity)
        
        IngredientStockModel.updateOne({ingredientName:req.body.ingredient_names},
            {$inc: { totalUnitValue: Number(quantity)}}
            ).exec()

        res.redirect('/view_inventory-controller')

    }catch(error){
        res.status(500).send(error)
        console.log(error);
    }
    
})



//Renders the page to view recipes and its ingredients in Chef's POV
router.get('/view_recipe',async(req,res)=>{

    const recipe = await recipeModel.find({})

    try{
        //Read Database file
        //Retrieve recipeIngredients table
        res.render('view_recipe',{recipe:recipe});
        //EJS
    }catch(error){
        res.status(500).send(error);
        console.log(error)
    }
})

//AYIANA: Renders the page to view ingredients and its running balance, for Chef's POV
router.get('/view_inventory-chef',async(req,res)=>{

    const ingredients = await ingredientsModel.find({})

    try{
        //Read Database file
        //Retrieve recipeIngredients table
        res.render('view_inventory-chef',{ingredients:ingredients});
        //EJS
    }catch(error){
        res.status(500).send(error);
        console.log(error)
    }
})

//trial for cashier menu
router.get('/cashier_menu',async(req,res)=>{

    try{
        const getcashiermenu = new customerOrderModel({});
        const recipes = await recipeModel.find();
        const orders = new Array()
        const params = { 
            recipename : recipes, 
            customerorder : getcashiermenu,
            orders : orders
        }
        console.log(getcashiermenu);
        console.log(recipes);

        res.render('cashier_menu',params);
        }catch(error){
            res.status(500).send(error)
        }
    
})

router.post('/cashier_menu',async (req,res)=>{//Happens when submitting form of create_recipe EJS

    //SUMMARY:     Create recipe_table with values inputted from EJS

    try{
        
        const getcashiermenu = new customerOrderModel({ // Put fields into recipemodel
            quantity:req.body.quantity_value, //Table value : Inputted Data from EJS 
          })

          console.log(getcashiermenu)
          customerOrderModel.create(getcashiermenu) // Create table in MongoAtlas
        res.redirect('/')

    }catch(error){
        res.status(500).send(error)
        console.log(error)
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

    try{
        const ingredients = new IngredientsModel()
        const params = {
            ingredient : ingredients
        }
        res.render('create_ingredient',params)
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

router.post('/create_ingredient',async (req,res) =>{
    try{
        const ingredientType = new IngredientsModel({
            ingredientType:req.body.ingredient_type
        })
        IngredientsModel.create(ingredientType)
        res.redirect('/')
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
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

router.get('/view_discrepancy',(req,res) =>{
    res.render('view_discrepancy');
})


// export router to server.js
module.exports = router