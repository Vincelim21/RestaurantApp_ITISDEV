if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const DATABASE_URL = 'mongodb+srv://Raphael:santillan@cluster0.cko2nz6.mongodb.net/?retryWrites=true&w=majority'


const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const mongoose = require('mongoose')
const { MongoClient } = require('mongodb');
const client = new MongoClient(DATABASE_URL)
var bodyParser = require('body-parser')

// added flash and session
const flash = require('express-flash')
const session = require('express-session')
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

// added flash and session
app.use(flash())
app.use(session({
    //key that would encrypt information for us
    secret: process.env.SESSION_SECRET,
    //should we resave our session variable if nothing is changed
    resave: false,
    // do you wanna save an empty value in the session if there is no value
    saveUninitialized: false
}))

const indexRouter = require('./controller/index')
const ingredientsRouter = require('./controller/ingredients')
const cashierRouter = require('./controller/cashier')
const ordersRouter = require('./controller/orders')
const recipesRouter = require('./controller/recipes')
const reportsRouter = require('./controller/reports')
const loginRouter = require('./controller/login')


//get index route
//app.use('/',indexRouter)
app.use('/',indexRouter)
app.use('/cashier',cashierRouter)
app.use('/ingredients',ingredientsRouter)
app.use('/orders',ordersRouter)
app.use('/recipes',recipesRouter)
app.use('/reports',reportsRouter)
// app.use('/login',loginRouter)


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

/*
const PDFGenerator = require('pdfkit')
const fs = require('fs')

// instantiate the library
let theOutput = new PDFGenerator 

// pipe to a writable stream which would save the result into the same directory
theOutput.pipe(fs.createWriteStream('TestDocument.pdf'))

// write out file
theOutput.end()
    

module.exports = mongoose

*/