const youtubeLink = document.getElementById("videoId");
const submitBtn = document.getElementById("idSubmit");
const generate = document.getElementById("generateRoom");
const join = document.getElementById("joinRoom");
const roomId = document.getElementById("roomInput");
const roomValue = document.getElementById("roomValue");
const status = document.getElementById("status");

const socket = io();

// Generates random id
var ID = function () {
  return Math.random().toString(36).substr(2, 9);
};

// initial room value
var id = ID();
roomValue.innerHTML = id;

// random user id
var userId = ID();
var roomOwner = userId;

submitBtn.addEventListener("click", function(){
  // get the link value
  var link = youtubeLink.value;
  // parse the video id from link
  var videoId = link.split("v=")[1].split('?')[0];
  changeUrl(id, videoId);
});

generate.addEventListener("click", function(){
  id = ID();
  // set current user as room owner
  roomOwner = userId;
  roomValue.innerHTML = id;
  // get video id from player
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


socket.on('video-status-update', function(data){
  if( id == data['roomId'] ){
    if(data['statusCode'] == 2){
      player.pauseVideo();
    }else if(data['statusCode'] == 1){
      player.playVideo();
    }

    var difference = data['time'] - player.getCurrentTime();
    if(difference>2 || difference<-2){
        player.seekTo(data['time']);
    }
  }
});