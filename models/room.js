const mongose = require("mongoose");

const RoomSchema = new mongose.Schema({
  userIdSend: {
    type: String,
  },
  userNameSend: {
    type: String,
  },
  userIdReceive: {
    type: String,
  },
  userNameReceive: {
    type: String,
  },
  roomId: {
    type: String,
  },
});

const Room = mongose.model("Room", RoomSchema);
module.exports = Room;
