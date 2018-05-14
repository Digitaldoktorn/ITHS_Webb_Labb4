var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var database;
var bodyParser = require('body-parser');
var path = require('path');
var ObjectId = require('mongodb').ObjectID;

app.use('/', express.static(path.join(path.resolve(), 'public')));
app.use(express.static('../'));
app.use(bodyParser.json());

MongoClient.connect('mongodb://localhost:27017',

  function(error, client) {
    if (error) {
      console.error('failed to connect to server!');
      console.log(error);
    } else {
      console.log('connected to server!');
      database = client.db('messages');
    }
  });

app.get('/adminstring', function (request, response) {

  database.collection('string').find({ from: request.query.from }).toArray(function (error, result) {
    if (error) {
      console.log(error);
    }else {
      response.send(result);
    }
  });
});

app.get('/string', function (request, response) {

  database.collection('string').find({ $and : [
    { $or : [ { from: request.query.from }, { from: request.query.to } ] },
    { $or : [ { to: request.query.from }, { to: request.query.to } ] }
  ]
  }).toArray(function (error, result) {
    if (error) {
      console.log(error);
    }else {
      response.send(result);
    }
  });
});

app.get('/public', function (request, response) {

  database.collection('string').find(
    {  to: 'public' }).toArray(function (error, result) {
    if (error) {
      console.log(error);
    }else {
      response.send(result);
    }
  });
});


app.get('/onloadmsg', function (request, response) {

  database.collection('string').find({ to : request.query.user, stamp : {$gt: Number(request.query.time) }}).toArray(function (error, result) {
    if (error) {
      console.log(error);
    }else {
      response.send(result);
    }
  });
});

app.get('/user', function (request, response) {
  database.collection('user').find().toArray(function (error, result) {
    if (error) {
      console.log(error);
    }else {
      response.send(result);
    }
  });
});

app.get('/friends', function (request, response) {
  var query = [];
  var array = request.query.friend.split('/');

  array.map(function(name) {
    return query.push({'name': name });
  });

  database.collection('user').find({ $or: query }).toArray(function (error, result) {
    if (error) {
      console.log(error);
    }else {
      response.send(result);
    }
  });
});

app.get('/tfmsg', function (request, response) {
  database.collection('string').find({'stamp':{$gt: Number(request.query.time) } }).toArray(function (error, result) {
    if (error) {
      console.log(error);
    }else {
      response.send(result);
    }
  });
});


app.get('/allmsg', function (request, response) {
  database.collection('string').find().toArray(function (error, result) {
    if (error) {
      console.log(error);
    }else {
      response.send(result);
    }
  });
});

app.post('/string', function (request, response) {
  database.collection('string').insert(request.body, function (error, result) {
    if (error) {
      console.log(error);
    }else {
      response.send(result);
    }
  });
});

app.post('/user', function (request, response) {
  database.collection('user').insert(request.body, function (error, result) {
    if (error) {
      console.log(error);
    }else {
      response.send(result);
    }
  });
});




app.delete('/user', function (request, response) {
  database.collection('user').remove({}, function (error) {
    if (error) {
      console.log(error);
    }else {
      response.send({});
    }
  });
});

app.delete('/string', function (request, response) {
  database.collection('string').remove({}, function (error) {
    if (error) {
      console.log(error);
    }else {
      response.send({});
    }
  });
});

app.put('/user/:name', function (request, response) {
  database.collection('user').update(
    {name: request.params.name},
    {$push: {friends: request.body}},
    function (error, result) {
      if (error) {
        console.log(error);
      }else {
        response.send(result);
      }
    });
});

app.put('/confirm', function (request, response) {

  database.collection('user').update(
    {name: request.query.name, 'friends.name' : request.query.name2},
    {$set: {'friends.$.status': 'confirmed'}},{multi: true},
    function (error, result) {
      if (error) {
        console.log(error);
      }else {
        response.send(result);
      }
    });
});

app.put('/status', function (request, response) {
  database.collection('user').update(
    {name: request.query.user},
    {$set: {'status': request.query.status}},{upsert: true},
    function (error, result) {
      if (error) {
        console.log(error);
      }else {
        response.send(result);
      }
    });
});

app.put('/check', function (request, response) {
  database.collection('user').update(
    {name: request.query.user},
    {$set: {'checkout': Number(request.query.date)}},{upsert: true},
    function (error, result) {
      if (error) {
        console.log(error);
      }else {
        response.send(result);
      }
    });
});

/*app.put('/updateuser', function (request, response) {
  database.collection('user').update(
    {name: request.query.user},
    {$set: {'name': request.query.updatename, 'password': request.query.updatepassword, 'age': request.query.updateage, 'email': request.query.updatemail} },

    function (error, result) {
      if (error) {
        console.log(error);
      }else {
        response.send(result);
      }
    });
});*/
app.put('/updateuser', function (request, response) {
  database.collection('user').update(
    {name: request.query.user},
    {$set: {'name': request.query.user, 'password': request.query.newpass, 'age': request.query.newage,
      'surname': request.query.newsurname, 'email': request.query.newemail, }},{upsert: true},
    function (error, result) {
      if (error) {
        console.log(error);
      }else {response.send(result);}});
});


app.put('/adminmail:id', function (request, response) {
  database.collection('user').update(
    {_id: new ObjectId(request.params.id)},
    {$push: {mail: request.body}},
    function (error, result) {
      if (error) {
        console.log(error);
      }else {
        response.send(result);
      }
    });
});

app.put('/adminmail', function (request, response) {

  database.collection('user').update(
    {name: request.query.user, 'mail.id' : request.query.mail},
    {$set: {'mail.$.status': 'read'}},{multi: true},
    function (error, result) {
      if (error) {
        console.log(error);
      }else {
        response.send(result);
      }
    });
});

app.delete('/deleteuser:id', function (request, response) {
  database.collection('user').remove(
    {_id: new ObjectId(request.params.id)}, function (error) {
      if (error) {
        console.log(error);
      }else {
        response.send({});
      }
    });
});

app.delete('/deletemessage:id', function (request, response) {
  database.collection('string').remove(
    {_id: new ObjectId(request.params.id)}, function (error) {
      if (error) {
        console.log(error);
      }else {
        response.send({});
      }
    });
});

app.listen(3000, function () {
  console.log('The service is UPDATED and running!');
});
