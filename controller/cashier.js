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

    const ingredient = await ingredientsModel.find()
    

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
            const recipes = await recipeModel.findOne({recipeName:req.body.item_value[i]})
            const recipeIngredients = await recipeIngredientsModel.find({ingredientID:recipes.recipeID})

            for(v=o;v<recipeIngredients.length;v++){
                const ingredient = await ingredientsModel.findOne({ingredientType:recipeIngredients[v].ingredientType})
                var multiplier = getMultiplier(recipeIngredients[v].unit,ingredient.unit)
                

            }

            }
            res.redirect('/')
        }
    catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

function getMultiplier(ingredientOrderUnit,ingredientUnit) // Params: from unit,to unit Returns multiplier
{

    var multiplier = 0
    if(ingredientOrderUnit == "gram"){
        switch(ingredientUnit){
            case "kilogram": multiplier = 0.001; break;
            case "milliliter" :multiplier = 1; break;
            case "liter" : multiplier = 1000; break;
            case "gallon" : multiplier =  0.000264172052; break;
            case "ounce" : multiplier = 0.035274; break;
            case "pound": multiplier = 0.00220462; break;
            case "milligram": multiplier = 1000; break;
        } 
    }
    else if(ingredientOrderUnit == "kilogram"){
        switch(ingredientUnit){
            case "gram": multiplier = 1000; break;
            case "milliliter" :multiplier = 1000; break;
            case "liter" : multiplier = 1; break;
            case "gallon" : multiplier = 3.79; break;
            case "ounce" : multiplier = 35.274; break;
            case "pound": multiplier = 2.20462; break;
            case "milligram": multiplier = 1000000; break;
        } 
    }
    else if (ingredientOrderUnit == "milliliter"){
        switch(ingredientUnit){
            case "gram": multiplier = 1; break;
            case "kilogram" :multiplier = 1000; break;
            case "liter" : multiplier = 0.001; break;
            case "gallon" : multiplier = 0.000264; break;
            case "ounce" : multiplier = 0.034; break;
            case "pound": multiplier = 0.0022; break;
            case "milligram": multiplier = 1000; break;
        } 
    }
    else if (ingredientOrderUnit == "liter"){
        switch(ingredientUnit){
            case "gram": multiplier = 1000; break;
            case "kilogram" :multiplier = 1; break;
            case "milliliter" : multiplier = 1000; break;
            case "gallon" : multiplier = 0.264; break;
            case "ounce" : multiplier = 33.814; break;
            case "pound": multiplier = 2.2; break;
            case "milligram": multiplier = 1000000; break;
        } 
    }
    else if (ingredientOrderUnit == "gallon"){
        switch(ingredientUnit){
            case "gram": multiplier = 3,785.41      ; break;
            case "kilogram" :multiplier = 3.785412; break;
            case "milliliter" : multiplier = 3785.41; break;
            case "liter" : multiplier = 3.78541; break;
            case "ounce" : multiplier = 128; break;
            case "pound": multiplier = 8.34; break;
            case "milligram": multiplier = 3,785,411.78; break;
        } 
    }
    else if (ingredientOrderUnit == "ounce"){
        switch(ingredientUnit){
            case "gram": multiplier = 28.35    ; break;
            case "kilogram" :multiplier = 0.028; break;
            case "milliliter" : multiplier = 29.57; break;
            case "liter" : multiplier = 0.0295; break;
            case "gallon" : multiplier = 0.0078; break;
            case "pound": multiplier = 0.0625; break;
            case "milligram": multiplier = 28349.5; break;
        } 
    }
    else if (ingredientOrderUnit == "pound"){
        switch(ingredientUnit){
            case "gram": multiplier = 453.59; break;
            case "kilogram" :multiplier = 0.454; break;
            case "milliliter" : multiplier = 453.59; break;
            case "liter" : multiplier = 0.45; break;
            case "gallon" : multiplier = 8.34; break;
            case "ounce": multiplier = 16; break;
            case "milligram": multiplier = 453592; break;
        } 
    }
    else if (ingredientOrderUnit == "milligram"){
        switch(ingredientUnit){
            case "gram": multiplier = 0.001; break;
            case "kilogram" :multiplier = 0.000001; break;
            case "milliliter" : multiplier = 0.001; break;
            case "liter" : multiplier = 0.000001; break;
            case "gallon" : multiplier = 3785.41; break;
            case "ounce": multiplier = 0.000035; break;
            case "pound": multiplier = 0.0000022; break;
        } 
    }
    else 
        return null
    console.log("MULTIPLIER FROM CONVERSION FUNCTION: "+multiplier)

    return multiplier
}
module.exports = router