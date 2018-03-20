var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var app = express();
var db;

app.use(bodyParser.json());

// Connecting to DB (Module 11)
MongoClient.connect('mongodb://localhost:27017', function(error, client) {
  if (error) {
    console.error('Failed to connect to the database!');
    console.log(error);
  } else {
    console.log('Successfully connected to the database!');
    db = client.db('chatApp');
  }
});

// GET-request. "find" is empty and will then get all objects in the collection. If you want to choose a certain object, enter the key/value pair within curly braces. "result" is the data that we get from the collection and what is presented in the browser after a fetch from frontend. THIS WORKS!!! (Module 11, exercise 4)
app.get('/', function(request, response){
  db.collection('message').find({}).toArray(function(error, result){
    response.send(result);
  });
});

// POST-request.
app.post('/message', function (request, response){
  db.collection('message').insert(request.body, function (error, result){
    response.send(result);
  });
});

// PUT-requst, replace with new data in Insomnia (Module 11 exercise 8)
app.put('/', function (request, response){
  db.collection('message').remove(
    {},
    function (error, result) {
      db.collection('message').insertMany(request.body, function(){
        response.send({});
      });
    }
  );
});

// DELETE-request - Enter id number after localhost:3000/ in Insomnia (Module 11 exercise 7)
app.delete('/:id', function (request, response) {
  db.collection('message').remove(
    { _id: new ObjectId(request.params.id) },
    function(error, result) {
      response.send({});
    }
  );
});

app.listen(3000, function(){
  console.log('The service is running!');
});
