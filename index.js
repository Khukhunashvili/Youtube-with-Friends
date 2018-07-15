const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

// connect to database
mongoose.connect("mongodb://localhost:27017/youtube_sync_app", { useNewUrlParser: true }, function(err, db){
  if(err){
    console.log(err);
  }else{
    console.log('Connected to database');
  }
});

// define Room Schema
var roomSchema = new mongoose.Schema({
  roomId: String,
  videoId: String
});

var Room = mongoose.model("Room", roomSchema);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index.ejs');
});

io.on('connection', function(socket){
  console.log('User connected');
  socket.on('url-change', function(data){
    // 1. get room by room id ( data['id'] )
    // 2. set value of video id to data['video-id']
    Room.update({ 'roomId' : data['id'] }, { $set: { videoId : data['video-id'] } }, { upsert: true }, function(err, newRoom){
      if(err){
        console.log("ERROR "+err);
      }else{
        io.emit('joined', {
          'roomId' : data['id'],
          'video-id' : data['video-id']
        });
      }
    });
  });

  socket.on('join', function(id){
    var room = Room.findOne({ 'roomId' : id }, 'roomId videoId', function(err, joinedRoom){
      if(err){
        console.log("ERROR"+err);
      }else{
        if(joinedRoom){
          console.log("CONNECTED ROOM"+joinedRoom);
          io.emit('joined', {
            'roomId' : joinedRoom['roomId'],
            'video-id' : joinedRoom['videoId']
          });
        } else{
          new Room({
            'roomId': id,
            'videoId': 'dQw4w9WgXcQ'
          }).save();
        }
      }
    });
  });

});

http.listen(8080, function(){
  console.log('Server started on port 8080');
});
