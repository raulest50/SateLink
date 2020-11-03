/**
 * El proposito del servidor websocket es permitir la visualizacion del contenido, de lo que se va 
 * registrando en las tablets con la app de irsum, en tiempo real desde un computador.
 * Este servidor ws sirve de puente entre las tablets y Orondo desktop app/ browser app.
 */

const TABLET_ORIG = "IRSUM";
const BROWSER_ORIG = "BROW";
const ORONDO_ORIG = "ORONDO";

const PROPOSITO_ID = "IDENTIFICARSE";
const PROPOSITO_UPDT_VENTA = "ACTUALIZAR_ESTADO_VENTA";

var irsum_clients = [];
var orondo_clients = [];
var browser_clients = [];


const WebSocket = require('ws');

// configuracion del servidor websocket
const wss = new WebSocket.Server({ port: 8080 });

/**
 * para que se pueda instanciar un servidor websocket desde index
 */
exports.set_up = function () {
    config_ws_server(wss);
}

/**
 * se pone en escucha el servidor web socket y se define la funcion on message
 */
function config_ws_server(wss){
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            msg = JSON.parse(message);
            switch(msg.proposito){
                case PROPOSITO_ID: // el cliente desea identificarse
                    registrar_cliente(ws, msg);
                    break;
                case PROPOSITO_UPDT_VENTA: // el cliente (solo tablet) desea notificar lista de venta
                    actualizar_venta_estado(ws, msg);
                    break;
            }
        });
    });
}

function registrar_cliente(ws, msg){
    switch(msg.body){
        case TABLET_ORIG:
            InsertOrUpdate({'ws':ws, 'nombre':msg.id}, irsum_clients);
            //irsum_clients.push({'ws':ws, 'nombre':msg.id});
            break;
        case BROWSER_ORIG:
            InsertOrUpdate({'ws':ws, 'nombre':msg.id}, browser_clients);
            //browser_clients.push({'ws':ws, 'nombre':msg.id});
            break;
        case ORONDO_ORIG:
            InsertOrUpdate({'ws':ws, 'nombre':msg.id}, orondo_clients);
            //orondo_clients.push({'ws':ws, 'nombre':msg.id});
            break;
    }
    console.log('irsum', irsum_clients);
    console.log('orondo', orondo_clients);
    console.log('browser', browser_clients);
}


/**
 * funcion que revisa si el nodo y esta en la lista lnodes. encaso de estar, actualiza 
 * los atributos. En caso contrario inserta el nodo en la lista lnodes
 */
function InsertOrUpdate(nodo, lnodes){
    r=false;
    for(x in lnodes){ // se comparan las direcciones mac
        if(lnodes[x].nombre.split('+')[1] == nodo.nombre.split('+')[1]){
            r=true; // en nombre en la segunda posicion del split('+') se encuentra la mac del nodo
            lnodes[x].nombre = nodo.nombre;
            lnodes[x].ws = nodo.ws;
        }
    }
    if(!r){
        lnodes.push(nodo);
    }
    return false;
}

/**
 * cuando una de las tablets notifica cambios en el ListView de ventas
 * el server reenvia dicho cambio a los observadores, que son las aplicaciones de orondo y
 * de browser
 * @param {} ws 
 * @param {*} msg 
 */
function actualizar_venta_estado(ws, msg){
    for(x in orondo_clients){
        orondo_clients[x].ws.send(msg.body);
    }
    for(x in browser_clients){
        browser_clients[x].ws.send()
    }
}