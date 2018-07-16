var mongoose = require('mongoose');

// define Room Schema
var roomSchema = new mongoose.Schema({
  roomId: String,
  videoId: String,
  roomOwner: String
});

module.exports = mongoose.model("Room", roomSchema);
