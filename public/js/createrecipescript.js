$(document).ready(function(){
    $("#add_ingredient").click(function(){
        $(".ingredientcontainer").after('<div class="next"></div>')
        const name = $('#ingredient_name').clone();
        const value = $('#ingredient_value').clone();
        const unit = $('#ingredient_unit').clone();
        
        $(name).appendTo(".next")
        $(value).appendTo(".next")
        $(unit).appendTo(".next")
        
        $(".next").removeAttr("class")
        
        console.log("asd")
    })
    
  });