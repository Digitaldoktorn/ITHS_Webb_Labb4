var express = require('express');
var bodyParser = require('body-parser');
var path = require('path'); // the path module makes it easier to use the static middleware
var MongoClient = require('mongodb').MongoClient;
//var ObjectId = require('mongodb').ObjectID;
var app = express();
var db;

app.use(bodyParser.json()); // middleware

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

// Serving static files --- (Module 10 exercise 7)
app.use(express.static(path.join(path.resolve(), 'public'))); // static-middleware

//create path for linking bundle.js (we might wanna work around this later to move the html-file to the frontend folder)
app.use(express.static('../'));

app.use(bodyParser.json());

// GET-request. "find" is empty and will then get all objects in the collection. If you want to choose a certain object, enter the key/value pair within curly braces. "result" is the data that we get from the collection and what is presented in the browser after a fetch from frontend. (Module 11, exercise 4)

// I added 'user' in the http requests below
app.get('/message', function(request, response){
  db.collection('message').find({}).toArray(function(error, result){
    if (error){
      console.log(error);
    } else {
      response.send(result);
    }
  });
});

app.get('/user', function(request, response){
  db.collection('user').find({}).toArray(function(error, result){
    if (error){
      console.log(error);
    } else {
      response.send(result);
    }
  });
});

// POST-request.
app.post('/message', function (request, response){
  db.collection('message').insert(request.body, function (error, result){
    if (error) {
      console.log(error);
    } else {
      response.send(result);
    }
  });
});

app.post('/user', function (request, response){
  db.collection('user').insert(request.body, function (error, result){
    if (error) {
      console.log(error);
    } else {
      response.send(result);
    }
  });
});

// PUT-requst, replace with new data in Insomnia (Module 11 exercise 8)
//BE CAREFULL HERE, THIS WILL DELETE ALL EXISTING MESSAGES!
app.put('/message', function (request, response){
  db.collection('message').remove(
    {},
    function (error, result) {
      db.collection('message').insertMany(request.body, function(){
        response.send(result);
      });
    }
  );
});
/*
//BE CAREFULL HERE, THIS WILL DELETE ALL EXISTING USERS!
app.put('/user', function (request, response){
  db.collection('user').remove(
    {},
    function (error, result) {
      db.collection('user').insertMany(request.body, function(){
        response.send({});
      });
    }
  );
});
*/
// PUT-requests New - March 24!
app.put('/user/:name', function (request, response) {
  db.collection('user').update(
    {name: request.params.name},
    {$push: {friends: request.body}},
    function (error, result) {
      if(error) {
        console.log(error);
      } else {
        response.send(result);
      }
    }
  );
});

app.put('/confirm', function (request, response){
  db.collection('user').update(
    {name: request.query.name, 'friends.friendsname': request.query.name2},
    {$set: {'friends.$.status': 'confirmed'}}, {multi: true},
    function (error, result) {
      if (error) {
        console.log(error);
      } else {
        response.send(result);
      }
    });
});

/*
// DELETE-request (old) - To delete an object from DB, enter id number after localhost:3000/ in Insomnia (Module 11 exercise 7).
app.delete('/:id', function (request, response) {
  db.collection('message').remove(
    { _id: new ObjectId(request.params.id) },
    function(error, result) {
      response.send({});
    }
  );
});

app.delete('/:id', function (request, response) {
  db.collection('user').remove(
    { _id: new ObjectId(request.params.id) },
    function(error, result) {
      response.send({});
    }
  );
});
*/

// DELETE-request-deletes the whole collection!
app.delete('/message', function (request, response) {
  db.collection('message').remove({}, function (error) {
    if (error) {
      console.log(error);
    } else {
      response.send({});
    }
  });
});

app.delete('/user', function (request, response) {
  db.collection('user').remove({}, function (error) {
    if (error) {
      console.log(error);
    } else {
      response.send({});
    }
  });
});


app.listen(3000, function(){
  console.log('The service is running! izA');
});
