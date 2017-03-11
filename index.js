var express = require('express');
var app = express();
var path    = require("path");

var point = 0;
app.use('/img',express.static(path.join(__dirname, '/images')));
app.use('/styles',express.static(path.join(__dirname, '/styles')));
app.use('/scripts',express.static(path.join(__dirname, '/scripts')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/index.html'));
})

app.get('/getpoint', function (req, res) {
  res.json({'currentPoint' : point});
})

app.get('/nextpoint', function (req, res) {

  point += 1;
  if(point > 1){
    point = 0;
  }
})

const port = process.env.PORT || 3000;


app.listen(port);
