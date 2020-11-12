

// para el web server local con express 
var express = require('express');
const bodyParser = require('body-parser');// se requiere para http POST
var app = express();
var http = require('http').createServer(app);
const HTTP_PORT = process.env.PORT || 3000;

// custom lib para hacer lecturas y escrituras a mongo.
var mongoH = require('./customlib/mongoHandling');

var bix = require('./customlib/printerManager');

exports.SetUpHttpServer = function(){

    app.use(express.static('public')); // expone todo el contenido de la carpeta public
    // el orden importa, debe ejecutarse antes de definir las rutas.
    app.use(bodyParser.urlencoded({ extended: true })); // con esto req.body ya no es null
    

    app.get('/', function (req, res) { // se configura el index
        res.sendFile(__dirname + '/index.html');
    });
  
    // app.get para procesar gets y app.all para procesar post y get
    // bp_codigo: buscar producto por codigo
    app.get('/buscar_producto', function (req, res) {
        buscar_producto(req.query.tipo_busqueda, req.query.busqueda, res);
    });
  
  
    app.post('/imprimir_remi', function(req, res){
        console.log('imprimir_remi')
        imprimir_remi(req, res);
        res.send("done");
    });

    app.get('/registrar_venta', function(req, res){
        RegistrarVenta(req, res);
    });    

    http.listen(HTTP_PORT, () => { // se activa express server
        console.log('Http at port ' + HTTP_PORT + ' :)');
        const internalIp = require('internal-ip'); // para conocer la direccion ip local facilmente
        console.log(internalIp.v4.sync());
    });
}


function RegistrarVenta(req, res){
    mongoH.insert_venta_transaction(req.query.venta)
}


function imprimir_remi(req, res){
    try{
        let lista_venta = req.body.lista_compra;
        console.log(req.body)
        bix.imprimir_draft(lista_venta);
    } catch(error){
        console.log(error.message);
    }
}


/**
 * 
 * @param {*} tp  tipo de busqueda
 * @param {*} b string de busqueda
 */
function buscar_producto(tp, b, res){
    try{
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
            //console.log('/buscar_producto finalizado :)');
        });
    } catch(error){
        console.log(error.message)
    }
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
