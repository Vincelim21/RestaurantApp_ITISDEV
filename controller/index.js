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
async function login_user() {

    try{
        const userDetails = await UserDetailsModel.findOne({email: "manager@gmail.com"})
        console.log("USER DETAILS "+userDetails)
        return userDetails.email
    }catch(error){
        console.log(error)
    }
}
async function login_user2() {

    try{
        const userDetails = await UserDetailsModel.findOne({email: "stock@gmail.com"})
        console.log("USER DETAILS "+userDetails)
        return userDetails.email
    }catch(error){
        console.log(error)
    }
}
async function login_user3() {

    try{
        const userDetails = await UserDetailsModel.findOne({email: "chef@gmail.com"})
        console.log("USER DETAILS "+userDetails)
        return userDetails.email
    }catch(error){
        console.log(error)
    }
}

function checklogin() {
    let username = req.body.email;
    let password = req.body.password;

    User.findOne({email:username, password:password}).lean().exec(function(err, result){
        console.log(result);
        console.log(result.display_Name)
        if(result.isAdmin){
            res.render('home_manager',{});
        }
        else if(!result.isAdmin){
            res.render('home_stockctrl', {});
        }
        else
            res.redirect("/");
    })
}

router.post('/login', async (req, res, next) => {
    try{
        var user = await login_user()
        var user2 = await login_user2()
        var user3 = await login_user3()
        console.log("login_user "+login_user())
        console.log(user)
        if( req.body.email == user) {
            res.render('home_manager')
            next()
        }
        else if( req.body.email == user2){
            res.render('home_stockctrl')
            next()
        }
        else if(req.body.email == user3) {
            res.render('home_chef')
            next()
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