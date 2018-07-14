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
  urlChange(id, videoId);
});

generate.addEventListener("click", function(){
  id = ID();
  roomId.value = id;
  urlChange(id, videoId);
});

join.addEventListener("click", function(){
  id = roomId.value;
  socket.emit('join', id);
})

function changeUrl(id, videoId){
  socket.emit('url-change', {
    'id': id,
    'video-id': player.getVideoData()['video_id']
  });
}
