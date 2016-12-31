var socket = io();

socket.on("new image",function(data){
  image = JSON.parse(data);
  console.log(image);

  var element = document.getElementById("imagenes");
  var contenido = element.innerHTML;

  console.log(contenido);

  contenido += "<div class='container'><div class='col-md-12 border'><h2>" + image.title + "</h2></div></div>";
  element.innerHTML = contenido;

});
