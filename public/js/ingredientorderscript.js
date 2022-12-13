var optionValues =[];
$('#reportDate').each(function(){
   if($.inArray(this.value, optionValues) >-1){
      $(this).remove()
   }else{
      optionValues.push(this.value);
   }
});