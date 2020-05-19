// para el web server local con express 
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const port = process.env.PORT || 3000;




// custom lib para hacer lecturas y escrituras a mongo.
var mongoH = require('./customlib/mongoHandling');

// custom lib relacionada con el servidor web socket
var wsH = require('./customlib/wsocketHandling');
// se inicia el servidor web socket.
wsH.set_up();




// configuracion del http server de express
// se configura el index
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// procesar get request
app.get('/buscar_producto', function (req, res) {
  console.log(req.query.nombre);
  mongoH.MultiInsertionTest([{nombre:'verde', valor:7}, {nombre:'magenta', valor:21}]);
  res.send('funcionamiento correcto');
});

// expone todo el contenido de la carpeta public
app.use(express.static('public'));

// se activa express server
http.listen(port, () => {
  console.log('listening at port' + port + ' :)');
});