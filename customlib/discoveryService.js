/**
 * crea un servidor UDP para escuchar broadcast de posibles clientes de IrsumApp
 * y responder con otro bradcast indicando la direccion ip del servidor.
 * sirve como un servicio de deteccion automatica o discovery para el servidor
*/

var dgram = require('dgram'); // hace parte de nodejs (default package)
var s = dgram.createSocket('udp4'); // udp ipv4

var UDP_PORT_OUT = 12100; // puerto por el que salen los datagramas
var UDP_PORT_IN = 2100; // puerto en el que se reciben datagramas

const internalIp = require('internal-ip'); // para conocer la direccion ip local facilmente
var LOCAL_IP = internalIp.v4.sync();

const bcast_ans_str = 'satelink.ip.ans:' + LOCAL_IP + ':';
const bcast_ans = Buffer.from(bcast_ans_str);



/**
 * funcion que inicia el servidor datagram socket o UDP
 */
exports.StartUDPListening = function(){

    s.on('message', (bmsg, ringfo)=>{ // on message
        let msg = bmsg.toString('ascii');
        console.log('got', msg, 'from', ringfo.address);
        if(msg == 'satelink.ip'){ // server ip broadcasting requested
            s.send(bcast_ans, UDP_PORT_OUT, getLocalBroadcastIP(), (err, bytes)=>{
                console.log(ringfo.address, ringfo.port, msg, bcast_ans_str);
            }); // local ip is broadcasted
        }
    });

    s.bind(UDP_PORT_IN, (err)=>{ //on bind finished
        s.setBroadcast(true);
        console.log("Local ip: ", `${LOCAL_IP}`);
        console.log("UDP Discovery in: ", `${UDP_PORT_IN}`,  "out: ", `${UDP_PORT_OUT}`);
    });
}

getLocalBroadcastIP = function(){
    let spl = LOCAL_IP.split('.');
    return spl[0] +'.'+ spl[1] +'.'+ spl[2] +'.'+ '255';
}
