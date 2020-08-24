
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





// ##############  HTTP resquest  ###############

// configuracion del http server de express
// se configura el index
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// app.get para procesar gets y app.all para procesar post y get
//bp_codigo: buscar producto por codigo
app.get('/buscar_producto', function (req, res) {
  console.log(req.query);
  let eh = false; // error happened
  try{

    let tp = req.query.tipo_busqueda;
    let b = req.query.busqueda;
    buscar_producto(tp, b, res);

  } catch(err){
    console.log(err.message);
  }

});

/**
 * 
 * @param {*} tp  tipo de busqueda
 * @param {*} b string de busqueda
 */
function buscar_producto(tp, b, res){
  let q_obj;

    switch(tp){
      case '0': // busqueda por codigo exacto
      q_obj = {_id: b};
        break;
  
      case '1': // busqueda por descripcion
        var kw = b.split(" "); // se separan las palabras clave
        var kwrgx = [];
        for(x in kw){
            kwrgx.push(RegExp(kw[x],'i')); // se construye el array de regex expressions
        }
        q_obj = {descripcion: {$all: kwrgx}};
        break;
  
      case '2': // busqueda por ultimos del codigo
        q_obj = {_id: RegExp(`${b}$`)};
        break;
    }
  
    mongoH.buscar(q_obj, mongoH.COLLECTION_PRODUCTOS, (docs)=>{
      res.send(docs);
      console.log('/buscar_producto finalizado :)');
    });
}


/*
app.post('/buscar_producto', function (req, res) {
  console.log('post request');
  console.log(req.body);
  mongoH.buscar({_id:`${req.query.codigo}`}, (docs)=>{
    res.send(docs);
    console.log('/buscar_producto finalizado');
  });
});
*/

// expone todo el contenido de la carpeta public
app.use(express.static('public'));

// se activa express server
http.listen(HTTP_PORT, () => {
  console.log('Http at port ' + HTTP_PORT + ' :)');
});





//  ############ UDP Liestening for automatic ip server discovery ###############

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
