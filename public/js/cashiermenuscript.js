function addItem(id){
    console.log(id);
    $(".table-header").after('<tr class="table-input">\
    <td>'+id+'</td>\
    <td><input type="text" name="quantity_value" value=""></td>\
    <td>PRICE</td>\
    </tr>')

}