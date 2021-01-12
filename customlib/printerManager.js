

var c = require('./bix350comandos'); // lista de comandos de la impresora termica
var format = require('date-format');

const {table, getBorderCharacters} = require('table');


exports.findBixolon = findBixolon;
exports.lista2txt = lista2txt;
exports.imprimir_draft = imprimir_draft;

var printer_ip=''; // direccion ip de la impresora

/**
 * El servicio de deteccion automatica se realizo gracias a la ing. inversa con wireshark de las 
 * comunicaicones y la ing inversa al codigo fuente de la app de android bixolon utility.
 * Funcionamiento: Se envia un paquete UDP broadcast con data=FIND.
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
                printer_ip = rinfo.address;
                s.close(); // if answer is received socket is closed
            }
        });
        s.send(m1, 48781, '255.255.255.255', (err) => { // on send message finished
            console.log(err); // if error occurs then log
        });
    });
}

findBixolon(); // se hace un udp broadcast para encontrar la direcion ip de la impresora.

function lista2txt(li){
    //console.log(li);
    let s="";
    //let val_row = [];
    let fmated;
    for(let x in li){
        if(li[x].p.descripcion.length>42)s += `${li[x].p.descripcion.substring(0,41)}\n`;
        else s += `${li[x].p.descripcion}\n`;
        fmated = table([[li[x].UnitPrecio, li[x].Cantidad, li[x].subTotal]], c.tbConfig);
        fmated = fmated.substring(0, fmated.length-1)
        s+= fmated;
    }
    return s;
}


function imprimir_draft(lista){
    let li = JSON.parse(lista);
    let blk_header = table([['$Unit.', 'Cant.', '$subTotal']], c.tbConfig);
    let blk_footer = table([['$TOTAL', '-', getTotalVenta(li)]], c.tbConfig);
    blk_header = blk_header.substring(0, blk_header.length-1);
    let blk = lista2txt(li);
    let msg = 
        c.printnv01 +
        c.setLeftAlign +
        '\n NIT: 43475437-1 \n'+
        'Direccion: Av 2BN #73CN 02\n' +
        'Tel. 6542985 \n' +
        'CALI VALLE DEL CAUCA\n' +
        `FECHA:  ${format.asString(format.DATETIME_FORMAT, new Date())}\n`+
        'print test\n'+
        c.setLeftAlign +
        blk_header +
        blk +
        `\n${blk_footer}` +
        c.printfeed8 +
        c.partialcut;

    console.log(msg);
    console.log(msg.length);
    console.log(Buffer.byteLength(msg, 'utf-8'));
    TCP_Send(msg);
}

function TCP_Send(msg){
    var net = require('net');
    var bix_ip = printer_ip;
    var conn = net.createConnection(c.PORT, bix_ip);
    conn.once('connect', ()=>{
        console.log('connected to bixolon printer');
        conn.write(msg, 'utf8', ()=>{
            conn.end();
        });
    });
}

function getTotalVenta(li){
    let s=0;
    for(let x in li){
        s+= li[x].subTotal;
    }
    return s.toString();
}
