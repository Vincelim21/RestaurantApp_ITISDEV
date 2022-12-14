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
const UnitModel = require("../models/unit")
const router = express.Router()
const mongoose = require('mongoose')
const { addListener } = require('../models/ingredient_stock')
const customerOrderModel = require('../models/customer_order')
const ingredientOrderHistoryModel = require('../models/ingredient_order_history')
const db = mongoose.connection


router.get('/ingredient_order_report',async (req,res) => {

    try{
       const orderHistory = await ingredientOrderHistoryModel.find({})
       const ingredientFirst = await IngredientFirstModel.find({})
       const ingredient = await IngredientsModel.find({})
       const unit = await UnitModel.find({})

       const params = {
        orderHistory : orderHistory,
        ingredientFirst: ingredientFirst,
        ingredient:ingredient,
        unit: unit
       }
        res.render('reports/ingredient_order_report',params)
    }catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

router.post('/ingredient_order_report',async (req,res) =>{
    try{
        let filters = []
        if(req.body.reportDate!=''){
            filters.push({"dateBought":req.body.reportDate})
        }
        if(req.body.ingredientName!=''){
            filters.push({"ingredientName":req.body.ingredientName})
        } 
        if(req.body.ingredientType!=''){
            filters.push({"ingredientType":req.body.ingredientType})
        }
        if(req.body.unit!=''){
            filters.push({"unit":req.body.unit})
        }
        
        filtersJSON = JSON.stringify(filters)
        console.log("Filters "+filtersJSON)

        filter1 = filters[0]
         filter1 = JSON.stringify(filter1)
         filter1 = JSON.parse(filter1)
         console.log("fILTER 1: "+filter1)
         const orderHistoryFiltered = await ingredientOrderHistoryModel.find(filter1)
         console.log(orderHistoryFiltered)

        

        res.render('reports/generate_report',{order_report:orderHistoryFiltered})
 
    }catch(error){
        console.log(error)

    }

})
router.get('/generate_report',async(req,res)=>{
    
})



module.exports = router