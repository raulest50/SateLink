// para el web server local con express 
var express = require('express');
var app = express();
var http = require('http').createServer(app);

var port = 3000;


// se sirve el index
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });
  // expone todo el contenido de la carpeta public
  app.use(express.static('public'));

// se activa express server
http.listen(port, function(){
    console.log('listening at port' + port + ' :)');
  });