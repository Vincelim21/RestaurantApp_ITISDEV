
/*
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  } */


const DATABASE_URL = 'mongodb+srv://Raphael:santillan@cluster0.cko2nz6.mongodb.net/?retryWrites=true&w=majority'


const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const mongoose = require('mongoose')
const { MongoClient } = require('mongodb');
const client = new MongoClient(DATABASE_URL)

//import index router
const indexRouter = require('./routes/routes')


//set layouts into ejs files (html -> ejs tayo sa sunod)
app.set('view engine', 'ejs')

//Set up render shortcuts (Layout is layout of all ejs) (views are ejs)
app.set('views',__dirname + '/views')
app.set('layout','partials/layout')


app.use(expressLayouts)
app.use(express.static('public'))



//get index route
app.use('/',indexRouter)
console.log('Server starting at Localhost:3000...')


//set up SERVER PORT ("Localhost:3000" in Browser)
app.listen(process.env.PORT || 3000)

//Database
async function connect(){
    try{
        await mongoose.connect(DATABASE_URL,{dbName:'restaurant_database'})
        console.log("Connected to Mongoose in: "+ DATABASE_URL)
    }catch(error){
        console.log(error)
    }
}
connect()

module.exports = mongoose

