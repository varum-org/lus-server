const mongose = require("mongoose");

const MessSchema = new mongose.Schema({
  room_id: {
    type: String,
  },
  user_id: {
    type: String,
  },
  content: {
    type: String,
  },
});

const Message = mongose.model("Message", MessSchema);
module.exports = Message;
