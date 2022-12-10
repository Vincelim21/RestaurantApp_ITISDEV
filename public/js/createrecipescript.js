$(document).ready(function(){
    $("#add_ingredient").click(function(){

        const name = $('#ingredient_name').clone();
        const value = $('#ingredient_value').clone();
        const unit = $('#ingredient_unit').clone();
        
        $(name).appendTo(".ingredients_in_recipe")
        $(value).appendTo(".ingredients_in_recipe")
        $(unit).appendTo(".ingredients_in_recipe")
        

        console.log("asd")
    })
    
  });