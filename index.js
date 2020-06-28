
/// ****** Configuracion Servidor HTTP Express

// para el web server local con express 
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const HTTP_PORT = process.env.PORT || 3000;


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
http.listen(HTTP_PORT, () => {
  console.log('Http at port ' + HTTP_PORT + ' :)');
});






const NetcatServer = require('netcat/server'); // para el servidor UDP  
// https://www.varonis.com/blog/netcat-commands/ -> solo si se instala netcat para usar en el cmd o terminal

const UDP_PORT_OUT = 12100; // puerto por el que salen los datagramas
const UDP_PORT_IN = 2100; // puerto en el que se reciben datagramas

// para conocer la direccion ip local facilmente
const internalIp = require('internal-ip');
var LOCAL_IP = internalIp.v4.sync();
console.log("direccion ip local   ", `${internalIp.v4.sync()}`);

// se debe obtener la direccion de broadcast ya que esta depenede de la subnet
var spl = LOCAL_IP.split('.');
var broadcast_ip = spl[0] +'.'+ spl[1] +'.'+ spl[2] +'.'+ '255';
console.log('Broadcast   ' + broadcast_ip);

// UDP server. se usa para que otras aplicaciones hagan un broadcast y puedan descubrir 
// de manera automatica el servidor.
var nc = new NetcatServer();
nc.udp().port(UDP_PORT_IN).listen().on('data', function (rinfo, data) {
  console.log('Got', data.toString(), 'from', rinfo.address, rinfo.port);

  // si el mensaje recivido es satelink.ip entonces el servidor realiza otro broadcast
  // indicando su direccion ip
  if(data.toString() == 'satelink.ip'){
    nc.udp().port(UDP_PORT_OUT).send('satelink.ip.ans:' + LOCAL_IP + ':', broadcast_ip);
  }
  //nc.close()
});
console.log('UDP IN at port   ' + UDP_PORT_IN + ' :)');
