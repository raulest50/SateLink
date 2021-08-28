///Todo lo relacionado a lecturas y escritoras en mongodb

// conector nativo para mongodb. no se usa mongoose porque es un object modeling tool
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const mongo_url = 'mongodb://localhost:27017';
// Database Name
const dbNombre = 'Retail';

const colecciones = {productos:'productos', rangosF:'rangofacturacion', ventas:'ventas'};

exports.colecciones = colecciones;




//Inserciones >>>
const insertDocuments = function (db, MiLista, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany(MiLista, function (err, result) {
        assert.equal(err, null);
        assert.equal(MiLista.length, result.result.n);
        assert.equal(MiLista.length, result.ops.length);
        console.log('mongoHandling', 'insertDocuments', `Inserted ${MiLista.length} documents into the collection`);
        callback(result);
    });
}

exports.multi_insert = function (MiLista) {
    const mongo_client = new MongoClient(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
    // Use connect method to connect to the server
    mongo_client.connect(function (err) {
        assert.equal(null, err);
        console.log('mongoHandling', 'multi_insert', "Connected successfully to server");
        const db = mongo_client.db(dbNombre);
        insertDocuments(db, MiLista, function () {
            mongo_client.close();
        });
    });
}


exports.insert_venta_transaction = function(venta_str, res){
    let venta = JSON.parse(venta_str);
    
    let nfecha = new Date(Date.now());
    venta.fecha_str = nfecha.toString();
    venta.fecha = nfecha;
    venta.id = venta._id;

    let valor = 0;
    venta.items.forEach( (item_venta)=> {
        valor += item_venta.subTotal;
    });

    venta.valor = valor;

    const mongo_client = new MongoClient(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
    mongo_client.connect( async function (err) {
        if (err) { return onErr(err); }
        
        // Step 1: Start a Client Session
        const session = mongo_client.startSession();

        // Step 2: Optional. Define options to use for the transaction
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
        // Note: The callback for withTransaction MUST be async and/or return a Promise.
        try {
            await session.withTransaction(async () => {
                const db = mongo_client.db(dbNombre);
                const collrf = db.collection(colecciones.rangosF);
                const collventas = db.collection(colecciones.ventas);
                
                // Important:: You must pass the session to the operations
                
                let sec = await collrf.findOne({_id:'consecutivo'});
                console.log( (Number(sec.valor)+1).toString() );
                venta._id = (Number(sec.valor)+1).toString();
                console.log(venta);

                await collventas.insertOne(venta, { session });
                await collrf.updateOne({_id:'consecutivo'}, { $set: {valor: venta._id} }, {session});

                }, transactionOptions);
            } catch(error){
                res.send("error");
            } finally {
                await session.endSession();
                await mongo_client.close();
                res.send("202"); // http code "ACCEPTED"
        }
    });
}



/**
 * primero se crea un mongoclient al cual se le pasa una funcion como argumento la cual se ejecuta cunado
 * se logra la conexion. al lograrse la conexion se crea un objeto tipo colleccion con el cual se hace la 
 * busqueda mediante collection.find  . a esta funcion se le pasa una funcion que se ejecutara una vez
 * se halla terminado collection.find, el resultado de la busqueda estara en docs.
 * finalmente se ejecuta callback(docs) que es una funcion que se pada desde index.js y permite
 * entregar el resultado del query al index.js dentro del paradigma de programacion asynchrona o non-blocking
 * @param {*} q_obj query object
 * @param {*} CNAME collection name
 * @param {*} callback function to execute when query finished
 */
exports.buscar = function (q_obj, CNAME, callback) {
    const mongo_client = new MongoClient(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
    mongo_client.connect(function (err) { // cuando se conecta ejecuta >>>
        if (err) { return onErr(err); } // proper error handling https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
        const db = mongo_client.db(dbNombre); // base de datos
        const collection = db.collection(CNAME); // coleccion
        collection.find(q_obj).toArray(function (err, docs) { // cuando termina collection.find ejecuta >>>
            if (err) { return onErr(err); }
            mongo_client.close();
            callback(docs);
        });
    });
}

function onErr(err) {
    console.log(err);
    return 1;
}

