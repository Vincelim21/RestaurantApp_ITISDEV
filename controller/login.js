// import module `database` from `../models/db.js`
const db = require('../models/db');
const express = require('express')
const bcrypt = require('bcrypt');

const UserDetailsModel = require('../models/user_details')
const router = express.Router()
var session = require('express-session');


/* router.post('/login', async(req,res) => {
    try {
        var email = req.body.email;
        console.log(email)
        console.log(req.body.email)
        var password = req.body.password;
        console.log(password)
        console.log(req.body.password)

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
                        console.log(position)
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

                            res.send({redirect: '/'});
                    }
                })
            }
        });

     }catch (error) {
        console.log(error)
        
    }
})
*/

   


module.exports = router;
