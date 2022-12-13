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

router.get('/view_inventory-controller',async(req,res) =>{
    
    const ingredientStock = await IngredientStockModel.find({})

    try{
        // Read Databasefile
          //Retrieve IngredientStock table
        res.render('ingredients/view_inventory-controller',{ingredStock:ingredientStock});
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
        res.render('ingredients/record_physical',{ingredStock:ingredientStock});
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

        const ingredientDiscrepancie = new discrepancieModel({  // Put fields into Ingredient First Model
            ingredientID: req.body.ingredient_names,
            quantityDiff:quantityDiff
          })
 
    
        discrepancieModel.create(ingredientDiscrepancie) 
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
        const getViewDiscrepancy = await discrepancieModel.find({});
        const getStockValue = await IngredientStockModel.find({});
        const params = { 
            discrep : getViewDiscrepancy // recipename in EJS file: recipename value retrieved
        } 
        console.log(getViewDiscrepancy);
        console.log(getStockValue);

        res.render('ingredients/view_discrepancy',params);
        }catch(error){
            res.status(500).send(error)
        }
    
})

router.get('/view_inventory-chef',async(req,res)=>{

    const ingredients = await ingredientsModel.find({})

    try{
        //Read Database file
        //Retrieve recipeIngredients table
        res.render('ingredients/view_inventory-chef',{ingredients:ingredients});
        //EJS
    }catch(error){
        res.status(500).send(error);
        console.log(error)
    }
})

router.get('/create_ingredient',async (req,res) => {

    try{
        const ingredients = new IngredientsModel()
        const units = await unitModel.find()
        const params = {
            ingredient : ingredients,
            unit : units
        }
        res.render('ingredients/create_ingredient',params)
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

router.post('/create_ingredient',async (req,res) =>{
    try{
        const ingredientType = new IngredientsModel({
            ingredientType:req.body.ingredient_type,
            unit:req.body.unit
        })
        IngredientsModel.create(ingredientType)
        res.redirect('/')
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

router.get('/record_spoiled',async(req,res) =>{
    
    try{
        // Read Databasefile
        const ingredientStock = await IngredientStockModel.find({});  //Retrieve IngredientStock table
        res.render('ingredients/record_spoiled',{ingredientStock:ingredientStock});
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
        
        IngredientStockModel.updateOne({ingredientName:req.body.ingredient_names},
            {$inc: { totalUnitValue: Number(-quantitySpoiled)}}
            ).exec()

        res.redirect('/ingredients/view_inventory-controller')

    }catch(error){
        res.status(500).send(error)
        console.log(error);
    }
    
})
module.exports = router