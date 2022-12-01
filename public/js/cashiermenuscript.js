function addItem(id,orders){
    
    $(".table-header").after('<tr class="table-input">\
    <td>'+id+'</td>\
    <td><input type="text" name="quantity_value" value=""></td>\
    <td>PRICE</td>\
    </tr>')
    console.log("HERE ORDERS" + orders);

    

}