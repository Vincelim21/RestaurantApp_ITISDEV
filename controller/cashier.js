const express = require('express')
const IngredientOrderModel = require('../models/ingredient_order')//ingredient_order table
const manualCountModel = require('../models/manual_count')
const discrepancyModel = require('../models/discrepancy')
const spoilageModel = require('../models/spoilage')
const UserDetailsModel = require('../models/user_details')
const recipeModel = require('../models/recipe')
const recipeIngredientsModel = require('../models/recipe_ingredients')
const IngredientStockModel = require("../models/ingredient_stock")
const router = express.Router()
const mongoose = require('mongoose')
const customerOrderModel = require('../models/customer_order')
const orderModel = require('../models/order')
const dailyUsageModel = require('../models/daily_usage')
const ingredientsModel = require('../models/ingredients')

router.get('/cashier_menu',async(req,res)=>{

    //SUMMARY : Render Cashier Menu with Recipe Data

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
        res.render('cashier/cashier_menu',params);
        }catch(error){
            res.status(500).send(error)
        }
    
})

router.post('/cashier_menu',async (req,res)=>{

    //SUMMARY: Decrease Ingredients and Ingredients Stock values based on Customer Orders

    try{
        let customerorder = new customerOrderModel({
            customerID: mongoose.Types.ObjectId()
        })
        customerOrderModel.create(customerorder)

        // Function : Separated by single or multiple orders

        if(req.body.quantity_value.length == 1){

            var dailyUsage = await dailyUsageModel.findOne({date:Date.today().toString("MMMM dS, yyyy")})
            if(dailyUsage == null){
                var createUsage = new dailyUsageModel({
                    dailyUsageID:mongoose.Types.ObjectId(),
                    date:Date.today().toString("MMMM dS, yyyy")
                })
                dailyUsageModel.create(createUsage)
            }
            console.log("Separator")
            console.log("Separator")
            console.log("Separator")
            

            var dailyUsage = await dailyUsageModel.findOne({date:Date.today().toString("MMMM dS, yyyy")})

            // Create orderModel from orders of the customer
            let orders = new orderModel({
                orderID:customerorder.customerID,
                dailyUsageID:dailyUsage.dailyUsageID,
                itemName:req.body.item_value,
                quantity:req.body.quantity_value
                })
            orderModel.create(orders)


            const recipes = await recipeModel.findOne({recipeName:req.body.item_value})
            const recipeIngredients = await recipeIngredientsModel.findOne({ingredientID:recipes.recipeID})
            const ingredients = await ingredientsModel.findOne({ingredientType:recipeIngredients.ingredientType})
            const stock = await IngredientStockModel.findOne({ingredientType:recipeIngredients.ingredientType})
                
            // Decrease Ingredients by ingredients used in order/s (with multiplier)
            var multiplierIngredient = getMultiplier(recipeIngredients.unit,ingredients.unit)
            var minusToIngredients = (Number((recipeIngredients.totalUnitValue)*multiplierIngredient *req.body.quantity_value))*-1
            ingredientsModel.updateOne({
                   ingredientType:recipeIngredients.ingredientType,
                   $inc: { totalUnitValue:  minusToIngredients}
            }).exec()

            // Decrease Ingredients Stock by ingredients used in order/s (with multiplier)
            var multiplierStock = getMultiplier(recipeIngredients.unit,stock.unit)
            var minusToStock = (Number((recipeIngredients.totalUnitValue)*multiplierStock*req.body.quantity_value))*-1
            console.log("MINUS TO STOCK : "+ minusToStock + stock.unit)
            IngredientStockModel.updateOne({
                    ingredientType:recipeIngredients.ingredientType,
                    $inc: { totalUnitValue: minusToStock }
            }).exec()

            var dailyUsage = getDailyUsage(orders,ingredients,multiplierIngredient)
            ingredientsModel.updateOne(
                {ingredientType:recipeIngredients.ingredientType},
                { $set: {dailyUsage:dailyUsage}})





        }else{
            for(let i=0;i<req.body.quantity_value.length;i++){

            var dailyUsage = await dailyUsageModel.findOne({date:Date.today().toString("MMMM dS, yyyy")})

            if(dailyUsage == null){
                var createUsage = new dailyUsageModel({
                    dailyUsageID:mongoose.Types.ObjectId(),
                    date:Date.today().toString("MMMM dS, yyyy")
                })
                dailyUsageModel.create(createUsage)
            }
            console.log("Separator")
            var dailyUsage = await dailyUsageModel.findOne({date:Date.today().toString("MMMM dS, yyyy")})

            // Create orderModel from orders of the customer
            let orders = new orderModel({
                orderID:customerorder.customerID,
                dailyUsageID:dailyUsage.dailyUsageID,
                itemName:req.body.item_value,
                quantity:req.body.quantity_value
                })
            orderModel.create(orders)


            const recipes = await recipeModel.findOne({recipeName:req.body.item_value[i]})
            const recipeIngredients = await recipeIngredientsModel.findOne({ingredientID:recipes.recipeID})

            for(v=0;v<recipeIngredients.length;v++){
                const ingredients = await ingredientsModel.findOne({ingredientType:recipeIngredients.ingredientType})
                const stock = await IngredientStockModel.findOne({ingredientType:recipeIngredients.ingredientType})
                    
                // Decrease Ingredients by ingredients used in order/s (with multiplier)
                var multiplierIngredient = getMultiplier(recipeIngredients.unit,ingredient.unit)
                var minusToIngredients = (Number((recipeIngredients.totalUnitValue)*multiplierIngredient *req.body.quantity_value))*-1
                ingredientsModel.updateOne({
                    ingredientType:recipeIngredients.ingredientType,
                    $inc: { totalUnitValue:  minusToIngredients}
                }).exec()

                // Decrease Ingredients Stock by ingredients used in order/s (with multiplier)
                var multiplierStock = getMultiplier(recipeIngredients.unit,stock.unit)
                var minusToStock = (Number((recipeIngredients.totalUnitValue)*multiplierStock*req.body.quantity_value))*-1
                console.log("MINUS TO STOCK : "+ minusToStock + stock.unit)
                IngredientStockModel.updateOne({
                        ingredientType:recipeIngredients.ingredientType,
                        $inc: { totalUnitValue: minusToStock }
                }).exec()
                var dailyUsage = getDailyUsage(orders,ingredients,multiplierIngredient)
                ingredientsModel.updateOne(
                    {ingredientType:recipeIngredients.ingredientType},
                    { $set: {dailyUsage:dailyUsage}})
                }

            }
            

            
        }

        
        res.redirect('/')
    }
    catch(error){
        res.status(500).send(error)
        console.log(error)
    }
})

function getMultiplier(ingredientOrderUnit,ingredientUnit){// PARAMETERS: From unit , To unit

    //FUNCTION: Return multiplier based on parameters

    var multiplier = 0
    if(ingredientOrderUnit == "gram"){
        switch(ingredientUnit){
            case "gram": multiplier = 1; break;
            case "kilogram": multiplier = 0.001; break;
            case "milliliter" :multiplier = 1; break;
            case "liter" : multiplier = 0.001; break;
            case "gallon" : multiplier =  0.000264172052; break;
            case "ounce" : multiplier = 0.035274; break;
            case "pound": multiplier = 0.00220462; break;
            case "milligram": multiplier = 1000; break;
        } 
    }
    else if(ingredientOrderUnit == "kilogram"){
        switch(ingredientUnit){
            case "kilogram": multiplier = 1; break;
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
            case "milliliter": multiplier = 1; break;
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
            case "liter": multiplier = 1; break;
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
            case "milligallonliter": multiplier = 1; break;
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
            case "ounce": multiplier = 1; break;
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
            case "pound": multiplier = 1; break;
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
            case "milligram": multiplier = 1; break;
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

async function getDailyUsage(orders,ingredients,multiplier){

    var daysLength = await dailyUsageModel.find({dailyUsageID:orders.dailyUsageID})
    var orders = await orderModel.find({itemName:ingredients.ingredientType})
    var totalIngredientValue = 0

    for(var i = 0;i< daysLength.length;i++){

        var ingredientValue = await ingredientsModel.findOne({ingredientType: orders[i]})
        if(ingredientValue !=null){
            totalIngredientValue += ingredientValue * (orders[i].quantity*multiplier)
        }
    }

    var dailyUsageComputation = daysLength.length*totalIngredientValue

    return dailyUsageComputation

}
module.exports = router