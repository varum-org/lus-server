const mongose = require("mongoose");

const RoomSchema = new mongose.Schema({
  user_id: {
    type: Array,
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
});

const Room = mongose.model("Room", RoomSchema);
module.exports = Room;
