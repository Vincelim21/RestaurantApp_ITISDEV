const express = require('express')
const router = express.Router()
const UserDetailsModel = require('../models/user_details')
const mongoose = require('mongoose')
const db = mongoose.connection
const bcrypt = require('bcrypt')

router.get('/', async(req,res) =>{
    res.render('login')
})

// trial start
// this will return manager email
async function login_user() {

    try{
        const userDetails = await UserDetailsModel.findOne({email: "manager@gmail.com"})
        // console.log("USER DETAILS "+userDetails)
        return userDetails.email
    }catch(error){
        console.log(error)
    }
}

// this will return manager password
async function password_user() {

    try{
        const userDetails = await UserDetailsModel.findOne({password: "$2b$10$Au5QxrxX7H00hZ1EekLf0uT5uOmzLXpQMeUYNow02KZWO3gCUdbX2"})
        console.log("USER DETAILS "+userDetails)
        return userDetails.password
    }catch(error){
        console.log(error)
    }
}

// this will return stock controller email
async function login_user2() {

    try{
        const userDetails = await UserDetailsModel.findOne({email: "stock@gmail.com"})
        // console.log("USER DETAILS "+userDetails)
        return userDetails.email
    }catch(error){
        console.log(error)
    }
}

// this will return stock controller password
async function password_user2() {

    try{
        const userDetails = await UserDetailsModel.findOne({password: "$2b$10$6StahTHb/f7hx/C0UXtZ3eQLbwcOXxqUkcWBoqojtVOdaRw30ohJa"})
        console.log("USER DETAILS "+userDetails)
        return userDetails.password
    }catch(error){
        console.log(error)
    }
}

// this will return chef email
async function login_user3() {
    try{
        const userDetails = await UserDetailsModel.findOne({email: "chef@gmail.com"})
        // console.log("USER DETAILS "+userDetails)
        return userDetails.email
    }catch(error){
        console.log(error)
    }
}

// this will return chef password
async function password_user3() {

    try{
        const userDetails = await UserDetailsModel.findOne({password: "$2b$10$TCQs4uhMhVVn1CwghZrtLOXAGMm/EwneqbbPtrU6H40bb3lgOSEoa"})
        console.log("USER DETAILS "+userDetails)
        return userDetails.password
    }catch(error){
        console.log(error)
    }
}

router.post('/login', async (req, res, next) => {
    try{
        //manager email
        var user = await login_user()
        //stock controller email
        var user2 = await login_user2()
        //chef email
        var user3 = await login_user3()
        //manager password
        var pass = await password_user()
        //stock controller password
        var pass2 = await password_user2()
        //chef password
        var pass3 = await password_user3()
        //compare the user input to the hashed password
        const pMatch =  await bcrypt.compare(req.body.password, pass) 
        console.log(req.body.password)
        console.log(pass)
        console.log(pMatch)
        // console.log("login_user "+login_user())
        // console.log(user)
        if( req.body.email == user) {
            res.render('home_manager')
            return next()
        }
        else if( req.body.email == user2){
            res.render('home_stockctrl')
            return next()
        }
        else if(req.body.email == user3) {
            res.render('home_chef')
            return next()
        }
        else 
            (req.body.email != user && user2 && user3)
            res.render('login')
    }
    catch(error){
        console.log(error)
    }
    
})
// trial end


router.get('/register', async(req,res) =>{
    try{
        const user_first = await UserDetailsModel.find({})
        const params = {
            user: user_first
        } 
        res.render('register',params) // Render EJS with table values
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

router.post('/register', async (req,res) =>{
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        this.password = hashedPassword
        const user = new UserDetailsModel({
            userID: req.body.userid,
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            userTypeName: req.body.usertype
        })
        console.log(this.email, this.password)
        UserDetailsModel.create(user)
        res.redirect('/')
        }
     catch (error){
        console.log(error)
        res.redirect('/register')
    }
    console.log(UserDetailsModel)
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