/**
 * para hacer pruebas rapidas de snippets en index.js
 */

 console.log("################################");

var mongoH = require('./customlib/mongoHandling');


const prompt = require('prompt');
prompt.start();
prompt.get(['cod'], function (err, result) {
    if (err) { return onErr(err); }
    console.log('Command-line input received:', result.cod);
    
    var req = {query:{nombre:result.cod}};
    console.log(req.query.nombre);

    var desc = req.query.nombre;
    
    mongoH.buscar({_id: RegExp(`${desc}$`,)},
     mongoH.COLLECTION_PRODUCTOS,
      (docs)=>{
        console.log('/mongo buscar 2');
        console.log(docs);
        console.log(docs.length);
      });
    
});

function onErr(err) {
    console.log(err);
    return 1;
}