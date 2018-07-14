const app = require('express')();
const http = require('http').Server(app);

app.get('/', function(req, res){
  res.send('<h1> Initial Commit </h1>');
});

http.listen(8080, function(){
  console.log('Server started on port 8080');
})
