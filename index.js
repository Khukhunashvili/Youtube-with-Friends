const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index.ejs');
});

io.on('connection', function(socket){
  console.log('User connected');
  socket.on('url-change', function(data){
    // TODO
    // 1. get room by room id ( data['id'] )
    // 2. set value of video id to data['video-id']
    console.log(data);
  });

  socket.on('join', function(id){
    // TODO
    // 1. get room by room id
    // 2. get video id
    console.log("Joined Room: "+id);
  });

});

http.listen(8080, function(){
  console.log('Server started on port 8080');
});
