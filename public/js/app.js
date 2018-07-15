const youtubeLink = document.getElementById('youtube-link');
const submitBtn = document.getElementById('link-submit');
const generate = document.getElementById('generate');
const join = document.getElementById('join');
const roomId = document.getElementById('room-id');
const status = document.getElementById('form-text');

const socket = io();

// Generates random id
var ID = function () {
  return Math.random().toString(36).substr(2, 9);
};

// initial room value
var id = ID();
roomId.value = id;

// random user id
var userId = ID();
var roomOwner = userId;

submitBtn.addEventListener("click", function(){
  var link = youtubeLink.value;
  var videoId = link.split("v=")[1].split('?')[0];
  changeUrl(id, videoId);
});

generate.addEventListener("click", function(){
  id = ID();
  roomOwner = userId;
  roomId.value = id;
  var videoId = player.getVideoData()['video_id'];
  changeUrl(id, videoId);
});

join.addEventListener("click", function(){
  id = roomId.value;
  socket.emit('join', { 'user-id' : userId, 'id' : id });
  status.innerHTML = "Connecting...";
  status.style.color = "#eeff00";
})

function changeUrl(id, videoId){
  socket.emit('url-change', {
    'id': id,
    'video-id': videoId,
    'user-id' : userId
  });
}

socket.on('joined', function(data){
  if( id == data['roomId'] ){
    roomOwner = data['roomOwner']
    console.log("ROOM OWNER: "+roomOwner);
    console.log("MY ID: "+userId);
    youtubeLink.value = 'https://www.youtube.com/watch?v='+data['video-id'];
    player.loadVideoById(data['video-id']);
    status.innerHTML = "Connected";
    status.style.color = "#21ff00";
  }
});

socket.on('url-changed', function(data){
  if( id == data['roomId'] ){
    player.loadVideoById(data['video-id']);
  }
});

if(roomOwner = userId){
  setInterval(function(){
    if(player.getPlayerState == 1){
      socket.emit('video-status-update', {
        'roomId' : id,
        'statusCode' : 1,
        'time' : player.getCurrentTime()
      });
    }
  }, 3000)
}

socket.on('video-status-update', function(data){
  if( id == data['roomId'] ){
    if(data['statusCode'] == 2){
      player.pauseVideo();
    }else if(data['statusCode'] == 1){
      player.playVideo();
    }

    var difference = data['time'] - player.getCurrentTime();
    if(difference>2 || difference<-2){
      if(roomOwner != userId){
        player.seekTo(data['time']);
      }
    }

  }
});
