const express = require('express')
const IngredientOrderModel = require('../models/ingredient_order')//ingredient_order table
const manualCountModel = require('../models/manual_count')
const router = express.Router()
const mongoose = require('mongoose')
const db = mongoose.connection


// First time use
router.get('/',(req,res) =>{
    //First Screen
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
router.get('/record_firsttime',(req,res) =>{
    //First Screen
    res.render('record_firsttime')
})
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