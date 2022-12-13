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
function login_user() {
    const userDetails = UserDetailsModel.findOne({email: "manager@gmail.com", password: "$2b$10$TCQs4uhMhVVn1CwghZrtLOXAGMm/EwneqbbPtrU6H40bb3lgOSEoa"}).lean().exec(function(err, user){
        //placeholder
        if(userDetails.userTypeName = 'Manager')
            return userDetails.userTypeName
            console.log()
    })
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

router.post('/login', async (req, res) => {
    if(login_user() == 'Manager') 
        res.render('home_manager')
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