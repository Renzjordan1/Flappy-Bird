const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
var path = require('path');
const fs = require('fs');

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

dir = path.join(__dirname);

// const model = tf.sequential();
// model.add(tf.layers.dense({units: 1, inputShape: [1]}));

// model.save('file://./models');
let express = require("express");
let app = express();

const mongodb = require('mongodb');
var assert = require('assert');
var assert = require('assert');

// Get a Mongo client to work with the Mongo server
var MongoClient = mongodb.MongoClient;

// Define where the MongoDB server is
var url = process.env.MONGODB_URI || 'input here';



console.log("saved");

var txt = fs.readFileSync(dir + '//static//models//scores.json', 'utf8');
// Parse it  back to object
scores = JSON.parse(txt);
// scores={};

app.use(function(req, res, next){
    console.log('${new Date()} - $(req.method) request for ${req.url}');
    next();
});

app.use(express.static("static"));
app.use(express.urlencoded());
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res) {
    // res.send("hello");
    res.sendFile(dir + '//static//flappyBird.html');
});

app.get('/name', function(req, res) {
    res.sendFile(dir  + '//static//name.html');

});

app.post('/leader', function(req, res) {


  const user = req.body.user;
  const score = Number(req.body.score);
  MongoClient.connect(url, function (err, client) {
    if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
      var db = client.db('Scores');

    // We are connected
    console.log('Connection established to', url);
 
    // Get the documents collection
    var collection = db.collection('board');
 

    add(collection, score, user, res);

  }
  });
  // console.log(score);
  // var x = {};
  // x["name"] = user;
  // x["score"] = Number(score);
  // if(score>=0){
  //     scores.push(x);
  //     // res.send(scores);
  //     var json = JSON.stringify(scores, null, 2);

  //     // var json = JSON.stringify(scores, null, 2);

  //     fs.writeFileSync(dir  + '//static//models//scores.json', json, 'utf8');
  // }
  // res.redirect('/board');
});

function add(collection, score, name, res){
    collection.insertOne({
      score: score,
      name: name
    }).then(function(response){
      res.redirect('/board');
    } );
}
function find(collection, res){
    collection.find().sort({"score": -1}).toArray().then(function(items) {
      console.log(items);
      res.render(dir  + '//static//leader.ejs', {scores:items});
    });


}

app.get('/board', function(req, res) {
  console.log('gey');

  // Connect to the server
  MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    var db = client.db('Scores');
    // We are connected
    console.log('Connection established to', url);
 
    // Get the documents collection
    var collection = db.collection('board');
 

    find(collection, res);
    // console.log("y: " + y);




    // res.render(dir  + '//static//leader.ejs', {scores:y});
  }
  });

  // const x = fs.readFileSync(dir  + '//static//models//scores.json', 'utf8');
  // var y = JSON.parse(x);
  // y.sort((a, b) => b.score - a.score);



});

app.listen(port, host, function() {
    console.log("Serving static on 3000");
});

