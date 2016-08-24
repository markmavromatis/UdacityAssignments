var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  var collection = db.collection('flights2015');
  collection.aggregate(
  	[ 
  		{ $match : {Origin : {$in : ["ATL",'ORD','DFW','DEN','LAX','SFO','IAH',
  				'PHX','LAS','MSP'] }}}, 
  		{ $group : { _id: {"Origin" : "$Origin", "month" : "$Month", 
  				"carrier" : "$Carrier"}, total : {$sum : 1},  
  				delays : {$sum : "$DepDel15"}}}, {$sort : {total : -1}}
  	]
  ) 
  .toArray(function(err, result) {
  		assert.equal(err, null);
  		console.log(result);
		db.close();
	  console.log("DONE 2");
  })
  console.log("DONE 1");
  // console.log("Results length: " + results.length);
});
