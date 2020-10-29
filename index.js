


// ###############  WEB SOCKET SERVER   ##################
var wsH = require('./customlib/wsocketHandling'); // codigo del servidor web socket
wsH.set_up(); // se inicia el servidor web socket.


// ###############  EXPRESS HTTP SERVER   ##################
var ServicioHttp = require('./customlib/HttpHandling'); // codigo del servidor http
ServicioHttp.SetUpHttpServer(); // se configuran las rutas


// ###############  UDP SERVER   ################## apagado para pruebas y no interfererir con production
// UDP Liestening for automatic ip server discovery
//var discoverUDP = require('./customlib/discoveryService');
//discoverUDP.StartUDPListening();


// https://www.varonis.com/blog/netcat-commands/ -> solo si se instala netcat para usar en el cmd o terminal