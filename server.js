
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
var bodyParser = require('body-parser')

//import index router


//set layouts into ejs files (html -> ejs tayo sa sunod)
app.set('view engine', 'ejs')

//Set up render shortcuts (Layout is layout of all ejs) (views are ejs)
app.set('views',__dirname + '/views')
app.set('layout','partials/layout')


app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(bodyParser.json())

const indexRouter = require('./controller/index')
const ingredientsRouter = require('./controller/ingredients')
const cashierRouter = require('./controller/cashier')
const ordersRouter = require('./controller/orders')
const recipesRouter = require('./controller/recipes')


//get index route
//app.use('/',indexRouter)
app.use('/',indexRouter)
app.use('/cashier',cashierRouter)
app.use('/ingredients',ingredientsRouter)
app.use('/orders',ordersRouter)
app.use('/recipes',recipesRouter)


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

