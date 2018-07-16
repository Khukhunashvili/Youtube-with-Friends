const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const Room = require('./models/Room.js');

// connect to database
mongoose.connect("mongodb://localhost:27017/youtube_sync_app", { useNewUrlParser: true }, function(err, db){
  if(err){
    console.log(err);
  }else{
    console.log('Connected to database');
  }
});

app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index.ejs');
});

io.on('connection', function(socket){
  console.log('User connected');
  socket.on('url-change', function(data){
    // 1. get room by room id ( data['id'] )
    // 2. set value of video id to data['video-id']
    Room.update({ 'roomId' : data['id'] }, { $set: { videoId : data['video-id'], roomOwner: data['user-id'] } }, { upsert: true }, function(err, newRoom){
      if(err){
        console.log("ERROR "+err);
      }else{
        io.emit('joined', {
          'roomId' : data['id'],
          'video-id' : data['video-id'],
          'roomOwner' : data['user-id']
        });
      }
    });
  });

  socket.on('video-status-update', function(data){
    io.emit('video-status-update', data);
  })

  socket.on('join', function(data){
    var room = Room.findOne({ 'roomId' : data['id'] }, 'roomId videoId roomOwner', function(err, joinedRoom){
      if(err){
        console.log("ERROR"+err);
      }else{
        if(joinedRoom){
          console.log("CONNECTED ROOM"+joinedRoom);
          io.emit('joined', {
            'roomId' : joinedRoom['roomId'],
            'video-id' : joinedRoom['videoId'],
            'roomOwner' : joinedRoom['roomOwner']
          });
        } else{
          new Room({
            'roomId': data['id'],
            'videoId': 'dQw4w9WgXcQ',
            'roomOwner': data['user-id']
          }).save();
        }
      }
    });
  });

});

http.listen(8080, function(){
  console.log('Server started on port 8080');
});
