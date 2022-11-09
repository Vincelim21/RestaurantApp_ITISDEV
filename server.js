
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

//import index router
const indexRouter = require('./routes/index')


//set layouts into ejs files (html -> ejs tayo sa sunod)
app.set('view engine', 'ejs')

//Set up render shortcuts (Layout is layout of all ejs) (views are ejs)
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')


app.use(expressLayouts)
app.use(express.static('public'))

/*MongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser : true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', ()=>console.log('Connected to Mongoose'))
*/

//get index route
app.use('/',indexRouter)
console.log('Server starting at Localhost:3000...')

//set up SERVER PORT ("Localhost:3000" in Browser)
app.listen(process.env.PORT || 3000)


/*
async function main() {
    const uri = "mongodb+srv://raphael:<password>@itisdev.axgfe0h.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try{
        await client.connect()
    }catch (e){
        console.error(e)
    }finally{
        await client.close()
    }
}   */