$(document).ready(function(){
    $("#searchinput").on("keyup", function() {
        console.log("POTA")
      var value = $(this).val().toLowerCase();
      $(".collapse").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });