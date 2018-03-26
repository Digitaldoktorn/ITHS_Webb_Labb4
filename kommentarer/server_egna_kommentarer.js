var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var app = express();
var db;

app.use(bodyParser.json());

// Hade missat att lägga in detta - för att koppla till DB (Från Modull 11)
MongoClient.connect('mongodb://localhost:27017', function(error, client) {
  if (error) {
    console.error('Failed to connect to the database!');
    console.log(error);
  } else {
    console.log('Successfully connected to the database!');
    db = client.db('chatApp');
  }
});


// GET-anrop - find är tom({}) - hämtar då allt i collection. Man kan skriva in värde, nyckelpar där för att välja vad man ska hämta. Result är det som hämtas i collection och presenteras på webben när man gjort en fetch från frontend. FUNKAR!!!
app.get('/', function(request, response){
  db.collection('message').find({}).toArray(function(error, result){
    response.send(result);
  });
});

// POST-anrop mot vår webbtjänst. Loggar sökvägsparameter i konsolen. Svarar med tomt JSON-objekt. . Uppdaterat av Alf. FUNKAR!!!
app.post('/message', function (request, response){
  db.collection('message').insert(request.body, function (error, result){
    response.send(result);
  });
});
/*
// min gamla kod
app.post('/message/:alias', function (request, response){
  console.log(request.params.alias);
  db.collection('message').insert(request.body, function(){
    response.send({});
  });
});
*/
// mongoDB PUT-anrop, ersätt med ny data i Insomnia - FUNKAR!!!
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

// mongoDB DELETE - skriv in i localhost samt objekts ID i Insomnia Delete-request (Modul 11 övn 7)-FUNKAR!!!
app.delete('/:id', function (request, response) {
  db.collection('message').remove(
    { _id: new ObjectId(request.params.id) },
    function(error, result) {
      response.send({});
    }
  );
});
/*
// GAMMAL KOD --- mongoDB DELETE - skriv in i localhost samt objekts ID i Insomnia Delete-request (Modul 11 övn 7)
app.delete('/:id', function (request, response) {
  console.log(request.params.id, new ObjectId(request.params.id));
  db.collection('message').remove(
    { _id: request.params.id},
    function(error, result) {
      if (error){
        console.log(error);
      } else {
        console.log(result);
        response.send({});
      }
    }
  );
});
*/
app.listen(3000, function(){
  console.log('The service is running!');
});
