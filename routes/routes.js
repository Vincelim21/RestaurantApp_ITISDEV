const express = require('express')
const router = express.Router()


// First time use
router.get('/',(req,res) =>{
    //First Screen
    res.render('cashier_menu')
})

router.get('/home_stockctrl',(req,res) =>{
    //First Screen
    res.render('home_stockctrl')
})


// export router to server.js
module.exports = router