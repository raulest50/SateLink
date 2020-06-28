
/// para mantener el index claro y optimo se remueve cualquier fragmento de codigo que no se use realmente 
/// en la implementacion, pero muchas veces ciertos fragmentos de codigo que sirven para tareas muy concretas
/// pueden ser utiles mas adelante, para evitar perderlos se crea este archivo, para recordar la forma en que
/// se usa alguna libreria, ya que aveces con los ejemplos de github o npm no es suficiente.



// <<<< para ejecutar el servidor Mdns se debe instalar previamente de npm 'multicast-dns  >>>
/// ****** Configuracion MDNS
/// para que las apps en android puedan conocer la direccion ip del servidor
/// haciendo un multicast discovery a 'satelink.local'

// para conocer la direccion ip local facilmente
const internalIp = require('internal-ip');
var LOCAL_IP = internalIp.v4.sync();
console.log("direccion ip local", `${internalIp.v4.sync()}`);

var mdns = require('multicast-dns')();// libreria de mdns de npm

const MDNS_DOMAIN_NAME = 'satelink.local'; // nombre de dominio del servidor en la red zeroconf mdns

/*
mdns.on('warning', function (err) {
  console.log(err.stack)
});

mdns.on('response', function (response) {
  console.log('got a response packet:', response)
});
*/

mdns.on('query', function (query) {
  // iterate over all questions to check if we should respond
  query.questions.forEach(function (q) {
    if (q.type === 'A' && q.name === MDNS_DOMAIN_NAME) {
      console.log('got a query packet:', query); // se logea solo si se esta escribiendo a satelink.local
      // send an A-record response for satelink.local
      mdns.respond({
        answers: [{
          name: MDNS_DOMAIN_NAME,
          type: 'A',
          ttl: 300,
          data: LOCAL_IP
        }]
      })
    }
  });
});

