// para el web server local con express 
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const port = process.env.PORT || 3000;

// para el servidor UDP
const NetcatServer = require('netcat/server');

// para conocer la direccion ip local facilmente
const internalIp = require('internal-ip');
var LOCAL_IP = internalIp.v4.sync();


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

// app.get para procesar gets y app.all para procesar post y get
app.get('/buscar_producto', function (req, res) {
  console.log(req.query);
  console.log(req.params);
  mongoH.buscar({nombre:`${req.query.nombre}`}, (docs)=>{
    res.send(docs);
    console.log('/buscar_producto finalizado');
  });
});

app.post('/buscar_producto', function (req, res) {
  console.log('post request');
  console.log(req.body);
  mongoH.buscar({nombre:`${req.query.nombre}`}, (docs)=>{
    res.send(docs);
    console.log('/buscar_producto finalizado');
  });
});

// expone todo el contenido de la carpeta public
app.use(express.static('public'));

// se activa express server
http.listen(port, () => {
  console.log('listening at port' + port + ' :)');
});


// UDP server. se usa para que otras aplicaciones hagan un broadcast y puedan descubrir 
// de manera automatica el servidor.
var nc = new NetcatServer()
nc.udp().port(2100).listen().on('data', function (rinfo, data) {
  console.log('Got', data.toString(), 'from', rinfo.address, rinfo.port);
  nc.udp().port(65002).send('server ip:' + LOCAL_IP);
  //nc.close()
})