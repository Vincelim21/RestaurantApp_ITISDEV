const express = require('express')
const IngredientOrderModel = require('../models/ingredient_order')//ingredient_order table
const manualCountModel = require('../models/manual_count')
const discrepancieModel = require('../models/discrepancie')
const spoilageModel = require('../models/spoilage')
const UserDetailsModel = require('../models/user_details')
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
const orderModel = require('../models/order')
const db = mongoose.connection

router.get('/cashier_menu',async(req,res)=>{

    try{
        const getcashiermenu = new customerOrderModel({});
        const recipes = await recipeModel.find();
        const order = await orderModel.find()
        const orders = new Array()
        const params = { 
            recipename : recipes, 
            customerorder : getcashiermenu,
            orders : orders,
            order : order
        }
        // console.log(getcashiermenu);
        // console.log(recipes);

        res.render('cashier/cashier_menu',params);
        }catch(error){
            res.status(500).send(error)
        }
    
})

router.post('/cashier_menu',async (req,res)=>{//Happens when submitting form of create_recipe EJS

    //SUMMARY:     Create recipe_table with values inputted from EJS

    try{
        let customerorder = new customerOrderModel({
            customerID: mongoose.Types.ObjectId()
        })
        customerOrderModel.create(customerorder)

        for(let i=0;i<req.body.quantity_value.length;i++){

            let orders = new orderModel({
                orderID:customerorder.customerID,
                itemName:req.body.item_value[i],
                quantity:req.body.quantity_value[i]
                })
            orderModel.create(orders)
            }
            res.redirect('/')

        }
    catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})
module.exports = router