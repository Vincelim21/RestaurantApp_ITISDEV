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
const discprepancieHistoryModel = require('../models/discpepancie_history')
const spoilageHistoryModel = require('../models/spoilage_history')
const ingredients_HistoryModel = require('../models/ingredients_history')
const ingredients_DailyHistoryModel = require('../models/ingredient_dailyHistory')
const db = mongoose.connection

router.get('/view_inventory-controller',async(req,res) =>{

    // SUMMARY : Get view inventory of controller page with ingredient stock data

    const ingredientStock = await IngredientStockModel.find({})

    try{
        res.render('ingredients/view_inventory-controller',{ingredStock:ingredientStock});
    }catch(error){
        res.status(500).send(error);
        console.log(error);
    }
})

router.get('/record_physical',async(req,res) =>{

    // SUMMARY : Get record physical page with ingredient stock data
    
    try{
        const ingredientStock = await IngredientStockModel.find({});
        console.log("Ingredient: "+ingredientStock) 
        res.render('ingredients/record_physical',{ingredStock:ingredientStock});
    }catch(error){
        res.status(500).send(error);
        console.log(error);
    }
})


router.post('/record_physical',async (req,res)=>{

    // SUMMARY: Submits user manual count input and calculates the difference of system inventory with the manual count

    try{
        const ingredientStockChosen = await IngredientStockModel.findOne({ingredientName:req.body.ingredient_names})
        var quantityDiff = req.body.fname - ingredientStockChosen.totalUnitValue  

       const history = await discprepancieHistoryModel.findOne({dateRecorded:Date.today().toString("MMMM dS, yyyy")})

       if(history ==null){
        const discrepancieHistory = new discrepancyHistoryModel({
            dateRecorded:Date.today().toString("MMMM dS, yyyy"),
            ingredientID:mongoose.Types.ObjectId()
            })
            discrepancyHistoryModel.create(discrepancieHistory)
        }

        console.log("HEREEEE: ")
        const discrepancieHistory = await discrepancyHistoryModel.findOne({dateRecorded:Date.today().toString("MMMM dS, yyyy")})
        

        const ingredientDiscrepancie = new discrepancieModel({
            ingredientID:discrepancieHistory.ingredientID,
            ingredientName: ingredientStockChosen.ingredientName,
            quantityDiff:quantityDiff
          })
 
    
        discrepancieModel.create(ingredientDiscrepancie) 
        console.log(quantityDiff)
        
        IngredientStockModel.updateOne({ingredientName:req.body.ingredient_names},
            {$inc: { totalUnitValue: Number(quantityDiff)}}
            ).exec()

            res.redirect('/ingredients/view_inventory-controller')
        
        //Add to Discpepancie History
        //discrepancieHistory(ingredientDiscrepancie)

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
        //Add to Ingredient History
        console.log(ingredients)
        ingredientsHistory(ingredients)
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
            unit:req.body.unit,
            ingredientID: mongoose.Types.ObjectId(),
            safetyStock:req.body.safety_stock
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
            ingredientID: req.body.ingredient_names,
            quantity:quantitySpoiled
          })
 
    
        spoilageModel.create(ingredientSpoiled) 
        
        IngredientStockModel.updateOne({ingredientName:req.body.ingredient_names},
            {$inc: { totalUnitValue: Number(-quantitySpoiled)}}
            ).exec()
    
        res.redirect('/ingredients/view_inventory-controller')

        //Add to Spoilage History
        console.log(ingredientSpoiled)
        spoilageHistory(ingredientSpoiled)

    }catch(error){
        res.status(500).send(error)
        console.log(error);
    }
    
})

//Function that creates Discprepancie History
async function discrepancieHistory(ingredientDiscrepancie){
    var findDiscrepancieHistory = await discprepancieHistoryModel.findOne({dateRecorded:Date.today().toString("MMMM dS, yyyy")})
       console.log("Find Discrepancie History: "+findDiscrepancieHistory)
       if(findDiscrepancieHistory == null){
        const discrepancieHistory = new discprepancieHistoryModel({
            dateRecorded: Date.today().toString("MMMM dS, yyyy"),
            ingredientDiscrepancie:ingredientDiscrepancie
           })
           discprepancieHistoryModel.create(discrepancieHistory)

       }
       else if (findDiscrepancieHistory !=null){
            findDiscrepancieHistory.ingredientDiscrepancie.push(ingredientDiscrepancie)
            console.log("INGREDIENT DISC: "+ingredientDiscrepancie)
            console.log(findDiscrepancieHistory.ingredientDiscrepancie)
            findDiscrepancieHistory.save()
       }
}

//Function that creates Discprepancie History
async function spoilageHistory(ingredientSpoiled){
    var findSpoilageHistory = await spoilageHistoryModel.findOne({dateSpoiled:Date.today().toString("MMMM dS, yyyy")});
       console.log("Find Spoilage History: "+findSpoilageHistory)
       try {
        if(findSpoilageHistory == null){
            const spoilageHistory = new spoilageHistoryModel({
                dateSpoiled:Date.today().toString("MMMM dS, yyyy"),
                ingredientSpoiled:ingredientSpoiled
               })
               spoilageHistoryModel.create(spoilageHistory)
    
           }
           else if (findSpoilageHistory !=null){
                findSpoilageHistory.ingredientSpoiled.push(ingredientSpoiled)
                console.log("INGREDIENT SPOILED: "+ingredientSpoiled)
                console.log(findSpoilageHistory.ingredientSpoiled)
                findSpoilageHistory.save()
           }
       } catch (error) {
        console.log(error)
       }
       
}
//Function that creates ingredient History
async function ingredientsHistory(ingredients){
    var findIngredientsHistory = await ingredients_HistoryModel.findOne({dateBought:Date.today().toString("MMMM dS, yyyy")});
       console.log("Find Spoilage History: "+findIngredientsHistory)
       try {
        if(findIngredientsHistory == null){
            const ingredientsHistory = new ingredients_HistoryModel({
                dateBought:Date.today().toString("MMMM dS, yyyy"),
                ingredientsList:ingredients
               })
               ingredients_HistoryModel.create(ingredientsHistory)
    
           }
           else if (findIngredientsHistory !=null){
                findIngredientsHistory.ingredientsList.push(ingredients)
                console.log("INGREDIENT SPOILED: "+ingredients)
                console.log(findIngredientsHistory.ingredientsList)
                findIngredientsHistory.save()
           }
       } catch (error) {
        console.log(error)
       }
}

//Function that creates ingredient daily history
async function ingredientsDailyHistory(ingredients){
    var findDailyIngredientsHistory = await ingredients_DailyHistoryModel.findOne({date:Date.today().toString("MMMM dS, yyyy")});
       console.log("Find Inventory Daily History: "+ findDailyIngredientsHistory)
       
       try {
        if(findDailyIngredientsHistory == null){
            const ingredientsHistory = new ingredients_DailyHistoryModel({
                date:Date.today().toString("MMMM dS, yyyy"),
                ingredient:ingredients
               })
               ingredients_DailyHistoryModel.create(ingredientsHistory)
    
           }
           else if (findDailyIngredientsHistory !=null){
            findDailyIngredientsHistory.ingredient.push(ingredients)
                console.log("INGREDIENT: "+ingredients)
                console.log(findDailyIngredientsHistory.ingredient)
                findDailyIngredientsHistory.save()
           }
       } catch (error) {
        console.log(error)
       }
}

module.exports = router