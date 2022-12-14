const express = require('express')
const router = express.Router()
const UserDetailsModel = require('../models/user_details')
const mongoose = require('mongoose')
const db = mongoose.connection
const recipeModel = require('../models/recipe')
const bcrypt = require('bcrypt')
const recipe = require('../models/recipe')
const bodyParser = require('body-parser')
let alert = require('alert'); 


router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async(req,res) =>{
    res.render('login')
})

router.get('/logout', async(req, res) =>{
    req.session.destroy(function(err) {
           if(err) throw err;
           res.redirect('/');
       })
});

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
        //console.log("USER DETAILS "+userDetails)
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
        //console.log("USER DETAILS "+userDetails)
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
        //console.log("USER DETAILS "+userDetails)
        return userDetails.password
    }catch(error){
        console.log(error)
    }
}

router.post('/login', async (req, res, next) => {


        var user = await UserDetailsModel.findOne({email:req.body.email})
        console.log(user)
        //manager email
        //var user = await login_user()
        //stock controller email
        //var user2 = await login_user2()
        //chef email
        //var user3 = await login_user3()
        //manager password
        //var pass = await password_user()
        //stock controller password
        //var pass2 = await password_user2()
        //chef password
        //var pass3 = await password_user3()

        var email = req.body.email   
        var password = req.body.password;
        
        //compare the user input to the hashed password
        bcrypt.compare(password, user.password, function(err, equal){
            console.log("user password: "+user.password)
            console.log("Req Body: "+req.body.password)
            if(equal){
                console.log(equal)
                req.session.firstName = user.firstName;
                req.session.lastName = user.lastName;
                req.session.email = user.email;
                req.session.userTypeName = user.userTypeName;
                
                console.log("Req Session: "+req.session.userTypeName)
                console.log("Req Password: "+req.body.password)

                if(req.session.email != null){

                    var position = req.session.userTypeName;
        
                    if(position == 'Manager')
                        position = 'manager';
        
                    if(position == 'Stock Controller')
                        position = 'stockctrl';
                    
                    if(position == 'Chef')
                        position = 'chef';
                    console.log(position)
                    res.render( "home_"+position.toLowerCase());
                            
                }
                else{
                    alert("Login Failed! Your email or password is incorrect")
                    res.render('login');
                }
            // console.log("login_user "+login_user())
            // console.log(user)
             /*   if( email == user.email && password == user.password) {
                    console.log(req.session.email)
                    console.log(user.email)
                    console.log(req.body.password)
                    console.log(user.password)
                    res.render('home_manager')
                    return next()
                }
                else if( req.body.email == user2 && pass2 == req.body.password){
                    console.log("user2")
                    res.render('home_stockctrl')
                    return next()
                }
                else if(req.body.email == user3 && pass3 == req.body.password) {
                    user("user3")
                    res.render('home_chef')
                    return next()
                }
                else {
                    console.log(email)
                    console.log("False")
                    res.render('login')
                }

                    //(req.body.email != user && user2 && user3)
                   
                }*/
        }
    })
})
// trial end

router.get('/manager_records',async(req,res) =>{
    
    const recipe = await recipeModel.find({})

    const params ={
        recipe:recipe,
    }

    try{
        res.render('manager_records', params);
        
    }catch(error){
        res.status(500).send(error);
        console.log(error);
    }
})

router.post('/manager_records', async(req,res)=>{
    //SUMMARY: Disable or Enable recipes

    try{
        // for(let i=0; i<req.body.recipeoption.length)
        console.log(req.body.recipeoption.length);
        for(let i=0;i<req.body.recipeoption.length;i++){
            if(req.body.selection[i]=='enable'){
                await recipeModel.updateOne({recipeName:req.body.recipeoption[i]},{active:true})
            }
            else{
                await recipeModel.updateOne({recipeName:req.body.recipeoption[i]},{active:false})
            }
            console.log("Turned "+ req.body.recipeoption[i] + " into " + req.body.selection[i])
        }
        res.redirect('/');
    }
    catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

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

router.get('/employeeView',async(req,res) =>{
    try{
        const users = await UserDetailsModel.find({})
        const params = { 
            users : users // recipename in EJS file: recipename value retrieved
        } 
        res.render('employeeView',params);
    }catch(error){
        res.status(500).send(error);
        console.log(error);
    }
})

module.exports = router