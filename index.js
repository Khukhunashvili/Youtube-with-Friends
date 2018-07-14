const express = require('express');
const app = express();
const http = require('http').Server(app);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index.ejs');
});

http.listen(8080, function(){
  console.log('Server started on port 8080');
});
