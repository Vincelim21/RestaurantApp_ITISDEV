// import module `database` from `../models/db.js`
const db = require('../models/db');
const express = require('express')
const bcrypt = require('bcrypt');

const UserDetailsModel = require('../models/user_details')
const router = express.Router()
var session = require('express-session');

//router.post('/login', loginController.postLogin);
//router.get('/login',loginController.login)
//router.get('/logout', loginController.logout);

const loginController = {

	login: function (req, res) {
        res.render('login');
	},

    logout: function (req, res) {
        req.session.destroy(function(err) {
               if(err) throw err;
               res.redirect('/login');
           });
     },

     postLogin: function(req,res){

        var email = req.body.email;
        var password = req.body.password;

        var projection = "_id userID firstName lastName email password userTypeName"

       db.findOne(UserDetailsModel,{email:email},projection,function(result){

            if(result){
                bcrypt.compare(password, result.password, function(err, equal){
                    if(equal){

                        req.session._id = result._id;
                      	req.session.userID = result.userID;
                      	req.session.firstName = result.firstName;
                        req.session.lastName = result.lastName;
                        req.session.userTypeName = result.userTypeName
                        
                        var position = req.session.userTypeName;
                       
                        if(position == 'Manager')
                            res.redirect('../views/home_manager.ejs');
                        else if(position =='Chef')
                            res.redirect('../views/home_chef.ejs');
                        else if(position == 'Stock Controller')
                            res.redirect('../views/home_stockctrl.ejs')
                    }
                    
                    else
                    {
                        var details = {
							flag: false,
							error: `Contact Number and/or Password is incorrect.`}

                            res.send({redirect: '/login'});
                    }
                })
            }
        });

     }
};

module.exports = loginController;
