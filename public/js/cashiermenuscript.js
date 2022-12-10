function addItem(id,orders){

    $(".table-header").after('<tr class="table-input">\
    <td><input type="text" value="'+id+'" name="item_value" readonly></td>\
    <td><input type="text" name="quantity_value"></td>\
    <td>PRICE</td>\
    </tr>')
   
    

}