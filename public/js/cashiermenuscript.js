function addItem(id){

    let dupemessage;

    if(document.getElementsByClassName("table-input").length == 0){
        $("#beforecontinue").after('<button class="continue" type="submit" href="/">CONTINUE</button>')
    }
    let duplicate = false;
    duplicate=false;
    for(let i=0;i<document.getElementsByClassName("table-input").length && duplicate != true;i++){
        // console.log(document.getElementsByClassName("tablevalue")[i].id)
        console.log(id)
        if(id == document.getElementsByClassName("tablevalue")[i].id){
            duplicate = true;
            dupemessage = id + " has already been addded"
            $("#errormsg").html(dupemessage)
        }
        else{
            duplicate = false;
            
        }
    }
    console.log("Duplicate is " + duplicate)
    if(!duplicate){
        $("#errormsg").empty()
        $(".table-header").after('<tr class="table-input">\
        <td><input class="tablevalue" "type="text" id ="'+id+'"value="'+id+'" name="item_value" readonly></td>\
        <td><input type="number" name="quantity_value" required></td>\
        <td>PRICE</td>\
        </tr>')
    }


}