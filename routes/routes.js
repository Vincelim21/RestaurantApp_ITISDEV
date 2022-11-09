const express = require('express')
const router = express.Router()


// First time use
router.get('/',(req,res) =>{
    //First Screen
    res.render('login')
})

router.get('/home_stockctrl',(req,res) =>{
    //First Screen
    res.render('home_stockctrl')
})

router.get('/cashier_menu',(req,res) =>{
    //First Screen
    res.render('cashier_menu')
})


// export router to server.js
module.exports = router