const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
var path = require('path');
const fs = require('fs');

dir = path.join(__dirname);

// const model = tf.sequential();
// model.add(tf.layers.dense({units: 1, inputShape: [1]}));

// model.save('file://./models');
let express = require("express");
let app = express();

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

app.get('/bird', function(req, res) {
    // res.send("hello");
    res.sendFile(dir + '//static//flappyBird.html');
});

app.get('/name', function(req, res) {
    res.sendFile(dir  + '//static//name.html');

});

app.post('/leader', function(req, res) {
  const user = req.body.user;
  const score = req.body.score;
  console.log(score);
  var x = {};
  x["name"] = user;
  x["score"] = Number(score);
  if(score>=0){
      scores.push(x);
      // res.send(scores);
      var json = JSON.stringify(scores, null, 2);

      // var json = JSON.stringify(scores, null, 2);

      fs.writeFileSync(dir  + '//static//models//scores.json', json, 'utf8');
  }
  res.redirect('/board');
});

app.get('/board', function(req, res) {
  const x = fs.readFileSync(dir  + '//static//models//scores.json', 'utf8');
  var y = JSON.parse(x);
  y.sort((a, b) => b.score - a.score);

  // console.log(y);

  res.render(dir  + '//static//leader.ejs', {scores:y});


});

app.listen(81, function() {
    console.log("Serving static on 81");
});

