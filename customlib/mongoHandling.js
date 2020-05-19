///Todo lo relacionado a lecturas y escritoras en mongodb

// conector nativo para mongodb. no se usa mongoose porque es un object modeling tool
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const mongo_url = 'mongodb://localhost:27017';
// Database Name
const dbNombre = 'granero';
const collectionName = 'productos';



//Inserciones >>>
const insertDocuments = function (db, MiLista, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany(MiLista, function (err, result) {
        assert.equal(err, null);
        assert.equal(MiLista.length, result.result.n);
        assert.equal(MiLista.length, result.ops.length);
        console.log(`Inserted ${MiLista.length} documents into the collection`);
        callback(result);
    });
}

exports.multi_insert = function (MiLista) {
    const mongo_client = new MongoClient(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
    // Use connect method to connect to the server
    mongo_client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = mongo_client.db(dbNombre);
        insertDocuments(db, MiLista, function () {
            mongo_client.close();
        });
    });
}



// Lecturas >>>
// se crea una funcion que recibe un objeto db, definido en mongodb, y una funcion llamada callback,
// la cual es definida por mi. la idea es usar esta custom function callback para pasar el resultado de
// la busqueda, docs.
// cb es un objeto que define los criterios de busqueda, si es vacio mongo trae todos los documentos
const findDocuments = function (db, cb, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    collection.find(cb).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Se encontraron los siguientes documentos:");
        console.log(docs);
        callback(docs);
    });
}

exports.buscar = function (cb, callback) {
    const mongo_client = new MongoClient(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
    mongo_client.connect(function (err) {
        assert.equal(null, err);
        console.log("Conexion a mongo exitosa");
        const db = mongo_client.db(dbNombre);

        findDocuments(db, cb, function (docs) {
            mongo_client.close();
            callback(docs);// se usa la funcion callback que se pasa desde el index.js como herramienta para
            //pasar el resultado
        });
    });
}



