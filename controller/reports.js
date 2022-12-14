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
const ingredientDaiyHistoryModel = require('../models/ingredient_dailyHistory')
const ingredient_dailyHistory = require('../models/ingredient_dailyHistory')
const ingredient_order_history = require('../models/ingredient_order_history')
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
        let filters1 = []

        if(req.body.reportDate!=''){
            filters.push({"dateBought":req.body.reportDate})
        }
        if(req.body.ingredientName!=''){
            filters1.push({"ingredientName":req.body.ingredientName})
        } 
        if(req.body.ingredientType!=''){
            filters1.push({"ingredientType":req.body.ingredientType})
        }
        if(req.body.unit!=''){
            filters1.push({"unit":req.body.unit})
        }
        

        if(filters.length != 0){
            var orderFilter = filters1[0]
            var historyFilter = filters[0]
            
            const orders = await IngredientOrderModel.find(orderFilter)
            const  orderHistoryFiltered= await ingredientOrderHistoryModel.find(historyFilter)
            console.log(orderHistoryFiltered)
           res.render('reports/generate_report',{order_report:orderHistoryFiltered, orders:orders})
        }
        else{
            const orders = await IngredientOrderModel.find({})
            const  orderHistoryFiltered= await ingredientOrderHistoryModel.find({})
            res.render('reports/generate_report',{order_report:orderHistoryFiltered, orders:orders})
        }
            
        
         console.log("fILTER 1: "+filter1)
        
 
    }catch(error){
        console.log(error)

    }

})
router.get('/generate_report',async(req,res)=>{
    
})
router.get('/ingredient_dailyHistory_report',async (req,res) => {
    try{
        const ingredient = await IngredientsModel.find({})
 
        const params = {
         ingredient:ingredient
        }
         res.render('reports/ingredient_dailyHistory_report',params)
     }catch(error){
         res.status(500).send(error)
         console.log(error)
     }
})

router.post('/ingredient_dailyHistory_report',async (req,res) =>{
    try{
        let filters = []

        if(req.body.reportDate!=''){
            filters.push({"date":req.body.reportDate})
            filters = JSON.parse(filters)
            const filteredDaily = await ingredientDaiyHistoryModel.find(filters)
            res.render('reports/generate_report',{order_report:filteredDaily})
        }
    }catch(error){

    }
})



module.exports = router