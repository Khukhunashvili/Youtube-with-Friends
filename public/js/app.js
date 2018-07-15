const youtubeLink = document.getElementById('youtube-link');
const submitBtn = document.getElementById('link-submit');
const generate = document.getElementById('generate');
const join = document.getElementById('join');
const roomId = document.getElementById('room-id');
const socket = io();

// Generates random id
var ID = function () {
  return Math.random().toString(36).substr(2, 9);
};

// initial value
var id = ID();
roomId.value = id;

submitBtn.addEventListener("click", function(){
  var link = youtubeLink.value;
  var videoId = link.split("v=")[1].split('?')[0];
  changeUrl(id, videoId);
});

generate.addEventListener("click", function(){
  id = ID();
  roomId.value = id;
  var videoId = player.getVideoData()['video_id'];
  changeUrl(id, videoId);
});

join.addEventListener("click", function(){
  id = roomId.value;
  socket.emit('join', id);
})

function changeUrl(id, videoId){
  socket.emit('url-change', {
    'id': id,
    'video-id': videoId
  });
}

socket.on('joined', function(data){
  if( id == data['roomId'] ){
    youtubeLink.value = 'https://www.youtube.com/watch?v='+data['video-id'];
    player.loadVideoById(data['video-id']);
  }
});
