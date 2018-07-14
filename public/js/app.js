const youtubeLink = document.getElementById('youtube-link');
const submitBtn = document.getElementById('link-submit');

submitBtn.addEventListener("click", function(){
  var link = youtubeLink.value;
  var id = link.split("v=")[1].split('?')[0];
  player.loadVideoById(id);
})
