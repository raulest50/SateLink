///Todo lo relacionado a lecturas y escritoras en mongodb

// conector nativo para mongodb. no se usa mongoose porque es un object modeling tool
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const mongo_url = 'mongodb://localhost:27017';
const mongo_client = new MongoClient(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
// Database Name
const dbNombre = 'granero';


const insertDocuments = function (db, MiLista, callback) {
    // Get the documents collection
    const collection = db.collection('productos');
    // Insert some documents
    collection.insertMany(MiLista, function (err, result) {
        assert.equal(err, null);
        assert.equal(MiLista.length, result.result.n);
        assert.equal(MiLista.length, result.ops.length);
        console.log(`Inserted ${MiLista.length} documents into the collection`);
        callback(result);
    });
}

exports.MultiInsertionTest = function(MiLista) {
    // Use connect method to connect to the server
    mongo_client.connect(function (err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = mongo_client.db(dbNombre);
        insertDocuments(db, MiLista,function () {
            mongo_client.close();
        });
    });
}

