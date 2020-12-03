const mongose = require("mongoose");

const RoomSchema = new mongose.Schema({
  user_id: {
    type: Array,
  },
});

const Room = mongose.model("Room", RoomSchema);
module.exports = Room;
