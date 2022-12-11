const express = require('express')
const router = express.Router()
const UserDetailsModel = require('../models/user_details')
const mongoose = require('mongoose')
const db = mongoose.connection

router.get('/', async(req,res) =>{
    res.render('login')
})

router.get('/register', async(req,res) =>{
    res.render('register')
})

router.get('/register', async(req,res) =>{
    res.render('register')
})

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
module.exports = router