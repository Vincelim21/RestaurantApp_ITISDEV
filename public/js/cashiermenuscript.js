function addItem(id){
    console.log(id);
    $(".table-header").after('<tr class="table-input">\
    <td>'+id+'</td>\
    <td><input type="text"</td>\
    <td>PRICE</td>\
    </tr>')

}