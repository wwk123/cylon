var MongoClient = require('mongodb').MongoClient
, assert = require('assert');
module.exports = {
    connectMongo : function(){
                // connection URL
        var url = 'mongodb://localhost:27107/myproject';
        // use connect method to connect to the Server
        MongoClient.connect(url, function(err, db){
            assert.equal(null, err);
            console.log("Connected correctly to server");
            this.insertDocuments(db, function(){
                this.updateDocument(db ,function(){
                    this.deleteDocument(db, function(){
                        // findDocuments(db, function(){
                            db.close();
                        // });
                    });
                });
            });
        });
    },
    insertDocuments: function(){
        // Get the documents collection
        var collection = db.collection('documents');
        // insert some documents
        collection.insertMany([
            {temp : data[0]}, {hum : data[1]},{lux : data[2]}
        ],function(err, result){
            assert.equal(err, null);
            assert.equal(3, result.result.n);
            assert.equal(3, result.ops.length);
            console.log("Inserted 3 documents into the documents collection");
            callback(err);    
        })        
    }
}

/**
 * result Contains the result documents from MondoDB
 * ops Contains the documents inserted with added _id fields
 * connection Contains the connection userd to perform the insert
 */
var insertDocuments = function(db, callback){
    // Get the documents collection
    var collection = db.collection('documents');
    // insert some documents
    collection.insertMany([
        {temp : data[0]}, {hum : data[1]},{lux : data[2]}
    ],function(err, result){
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the documents collection");
        callback(err);    
    })
}



// delete a document
var deleteDocument = function(db, callback){
    // Get the documents collection
    var collection = db.collection('documents');
    collection.deleteOne({a : 3},function(err, result){
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
};



// Find All insertDocuments
var findDocuments =  function(db, callback){
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function(err, docs){
        assert.equal(err, null);
        assert.equal(2, docs.length);
        console.log("Find the following records");
        console.dir(docs);
        callback(docs);
    });
};


