const express = require('express')
const router = express.Router()


// First time use
router.get('/',(req,res) =>{
    //First Screen
    res.render('login')
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
router.get('/view_inventory',(req,res) =>{
    //First Screen
    res.render('view_inventory')
})
router.get('/view_inventorypurchases',(req,res) =>{
    //First Screen
    res.render('view_inventorypurchases')
})
router.get('/view_recipe',(req,res) =>{
    //First Screen
    res.render('view_recipe')
})


router.get('/cashier_menu',(req,res) =>{
    res.render('cashier_menu')
})

router.get('/record_physical',(req,res) =>{
    res.render('record_physical')
})

// export router to server.js
module.exports = router