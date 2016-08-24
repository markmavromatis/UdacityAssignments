var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  var collection = db.collection('flights');
  collection.find({"Month" : 1}).toArray(function(err, docs) {
  	console.log("Found following records...");
  	console.log(docs.length);
  })
  db.close();
});