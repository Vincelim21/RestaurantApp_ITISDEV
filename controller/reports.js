const express = require('express')
const IngredientOrderModel = require('../models/ingredient_order')//ingredient_order table
const manualCountModel = require('../models/manual_count')
const discrepancieModel = require('../models/discrepancie')
const spoilageModel = require('../models/spoilage')
const UserDetailsModel = require('../models/user_details')
const CustomerOrderModel = require('../models/customer_order')
const recipeModel = require('../models/recipe')
const ingredientsModel = require('../models/ingredients')
const recipeIngredientsModel = require('../models/recipe_ingredients')
const IngredientsModel = require("../models/ingredients")
const IngredientFirstModel = require("../models/ingredient_first")
const IngredientStockModel = require("../models/ingredient_stock")
const unitModel = require("../models/unit")
const router = express.Router()
const mongoose = require('mongoose')
const { addListener } = require('../models/ingredient_stock')
const customerOrderModel = require('../models/customer_order')
const ingredientOrderHistoryModel = require('../models/ingredient_order_history')
const db = mongoose.connection


router.get('/ingredient_order_report',async (req,res) => {

    try{
       const orderHistory = await ingredientOrderHistoryModel.find({})

       const params = {
        orderHistory : orderHistory
       }
        res.render('reports/ingredient_order_report',params)
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

router.post('/ingredient_order_report',async (req,res) =>{



    
})



module.exports = router