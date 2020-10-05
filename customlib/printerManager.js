

/**
 * El servicio de deteccion automatica se descubrio haciendo ing inversa con wireshark
 * y a la app de android bixolon utility. Se envia un paquete UDP broadcast con data=FIND.
 * La impresora srp 350 iii plus respondera con otro mensaje de broadcast con IMIN al inicio
 * de data, los demas bytes del mensaje indican datos de la impresora, entre ellos su direccion 
 * ip actual
 */
function findBixolon() {

    var m1 = Buffer.from('FIND'); // only for wired interface

    var m2 = Buffer.from('__[I_F]__[PRT_REG]'); // for wireless interface

    // para enviar udp packets
    var dgram = require('dgram');

    var s = dgram.createSocket('udp4');
    s.bind(48780, (err) => { // on bind finished
        s.setBroadcast(true); // throws error if called before bind finished
        s.on('message', function (msg, rinfo) { // litens for printer udp broadcast response
            if (rinfo.port == 48781) {
                console.log(rinfo.address); // printer current ip address
                console.log('rev:   ' + msg.toString());
                s.close(); // if answer is received socket is closed
            }
        });
        s.send(m1, 48781, '255.255.255.255', (err) => { // on send message finished
            console.log(err); // if error occurs then log
        });
    });

}