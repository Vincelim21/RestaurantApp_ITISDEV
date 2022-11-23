const express = require('express')
const IngredientOrderModel = require('../models/ingredient_order')//ingredient_order table
const manualCountModel = require('../models/manual_count')
const discrepancieModel = require('../models/discrepancie')
const spoilageModel = require('../models/spoilage')
const UserTypeModel = require('../models/user_type')
const UserDetailsModel = require('../models/user_details')
const CustomerOrderModel = require('../models/customer_order')
const menuModel = require('../models/menu')
const recipeModel = require('../models/recipe')
<<<<<<< Updated upstream
const unitModel = require('../models/unit')
const conversionModel = require('../models/conversion')
const ingredentsModel = require('../models/ingredients_chef')
const recipe_ingredientsModel = require('../models/recipe_ingredients_chef')
=======
const IngredientsModel = require("../models/ingredients")
const IngredientFirstModel = require("../models/ingredient_first")
const IngredientStockModel = require("../models/ingredient_stock")
>>>>>>> Stashed changes
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
        const ingredient = await IngredientsModel.find({})
        const ingredient_first = new IngredientFirstModel()
        const params = {
            ingredients: ingredient,
            ingredientorder : ingredient_first
        }
        res.render('record_firsttime',params)
        
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }

    
})
router.post('/record_firsttime',async (req,res)=>{
    try{
        const ingredientFirst = new IngredientFirstModel({
            ingredientName:req.body.name,
            unitValue:req.body.unitValue,
            ingredientType: req.body.ingredientType
            
          })
 
    
        IngredientFirstModel.create(ingredientFirst) 
        

    }catch(error){
        res.status(500).send(error)
    }
    
})

router.get('/record_itempurchase',async (req,res)=>{
    try{
        const ingredientFirst = await IngredientFirstModel.find({})
        console.log(ingredientFirst)
        const ingredientOrder = new IngredientOrderModel()

        const params = {
            ingredientorder: ingredientOrder,
            ingredientfirst : ingredientFirst
        }
        res.render('record_itempurchase',params)
        
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }


})

router.post('/record_itempurchase',async (req,res)=>{
    try{
       const ingredientFirst = await IngredientFirstModel.find({ingredientName:req.body.name})
       console.log("Ingredient First: "+ ingredientFirst)
       
       console.log("1")
       const ingredientOrder = new IngredientOrderModel({
        ingredientName:ingredientFirst.ingredientName,
        ingredientType:ingredientFirst.ingredientType,
        unitValue:ingredientFirst.unitValue,
        quantityBought:req.body.quantity
       })
       IngredientOrderModel.create(ingredientOrder)


       var query = {ingredientType:ingredientOrder.ingredientType}
       var valueQuery = ingredientOrder.quantityBought * ingredientOrder.unitValue
       
       console.log("2")
       const ingredientsModelQuery = IngredientsModel.findOneAndUpdate({query,$inc : {'totalUnitValue' : valueQuery } })
       
       
       console.log(ingredientOrder)
       
       console.log("3")
       const ingredientStockQuery = await IngredientStockModel.findOne({ingredientName:ingredientOrder.ingredientName})

       console.log("4")
       if ( ingredientStockQuery== null){
        const ingredientStock = new IngredientStockModel({
            ingredientName:ingredientFirst.ingredientName,
            ingredientType:ingredientFirst.ingredientType
        })
        ingredientStock.$inc({totalUnitValue:valueQuery})
       }
       else{
        ingredientStockQuery.totalUnitValue.$inc({totalUnitValue:valueQuery})

       }
       console.log(ingredientOrder)
       console.log(ingredientStockQuery)
       console.log(ingredientsModelQuery)



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

router.get('/test_userType',async (req,res) =>{ //TEST DATA HERE (can be accessed in home page)
    
    const usertype = await UserTypeModel.findOne({userTypeID: "9001"})
    
    try{
        res.render('test_userType',{usertype /* nakalagay na "ingredient" sa ejs (loob ng <%=)*/:usertype})
        console.log(usertype) //check lang
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