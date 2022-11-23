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

router.get('/test_test',async (req,res) =>{ //TEST DATA HERE (can be accessed in home page)
    
    const ingredient = await IngredientOrderModel.findOne({ingredientId: "55445"})
    
    try{
        res.render('test_test',{ingredient /* nakalagay na "ingredient" sa ejs (loob ng <%=)*/:ingredient})
        console.log(ingredient) //check lang
    }catch(error){
        res.status(500).send(error)
    }

})
router.get('/record_firsttime',async(req,res) =>{
    
    try{
        // Read Databasefile
        const ingredient = await IngredientsModel.find({})  //Retrieve Ingredients table
        const ingredient_first = new IngredientFirstModel() // Create Ingredients Firsttime table
        const params = {
            ingredients: ingredient,
            ingredientorder : ingredient_first
        } //EJS 
        res.render('record_firsttime',params)
        
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }

    
})
router.post('/record_firsttime',async (req,res)=>{
    try{
        const ingredientFirst = new IngredientFirstModel({ // Put fields into Ingredient First Model
            ingredientName:req.body.name,
            unitValue:req.body.unitValue,
            ingredientType: req.body.ingredientType
            
          })
 
    
        IngredientFirstModel.create(ingredientFirst) 
        res.redirect('/')
        

    }catch(error){
        res.status(500).send(error)
    }
    
})

router.get('/record_itempurchase',async (req,res)=>{
    try{
        const ingredientFirst = await IngredientFirstModel.find({}) //Get INgredients First Table
        console.log(ingredientFirst)
        const ingredientOrder = new IngredientOrderModel() // Create Ingredient Order table

        const params = {
            ingredientorder: ingredientOrder,
            ingredientfirst : ingredientFirst
        } // EJS
        res.render('record_itempurchase',params)
        
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }


})

router.post('/record_itempurchase',async (req,res)=>{
    try{
       const ingredientFirst = await IngredientFirstModel.find({ingredientName:req.body.name}) //
       console.log("Ingredient First: "+ ingredientFirst)
       
       console.log("1")
       const ingredientOrder = new IngredientOrderModel({
        ingredientName:ingredientFirst.ingredientName,
        ingredientType:ingredientFirst.ingredientType,
        unitValue:ingredientFirst.unitValue,
        quantityBought:req.body.quantity
       })
       IngredientOrderModel.create(ingredientOrder)  // Create Ingredient Order Table
 

       var query = {ingredientType:ingredientOrder.ingredientType}
       var valueQuery = ingredientOrder.quantityBought * ingredientOrder.unitValue
       
       console.log("2")
       const ingredientsModelQuery = IngredientsModel.findOneAndUpdate({query,$inc : {'totalUnitValue' : valueQuery } }) // Add Ingredients Table
       
       
       console.log(ingredientOrder)
       
       console.log("3")
       const ingredientStockQuery = await IngredientStockModel.findOne({ingredientName:ingredientOrder.ingredientName}) // Compare Ingredient Order name with Ingredient Name

       console.log("4")
       if ( ingredientStockQuery== null){
        const ingredientStock = new IngredientStockModel({
            ingredientName:ingredientFirst.ingredientName,
            ingredientType:ingredientFirst.ingredientType
        })
        ingredientStock.$inc({totalUnitValue:valueQuery})
       }
       else{
        ingredientStockQuery.totalUnitValue.$inc({totalUnitValue:valueQuery}) // Add Ingredient Order value to Ingredient Stock Value

       }
       console.log(ingredientOrder)
       console.log(ingredientStockQuery)
       console.log(ingredientsModelQuery)



    }catch(error){
        res.status(500).send(error)
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