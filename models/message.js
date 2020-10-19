const mongose = require("mongoose");

const MessSchema = new mongose.Schema({
  roomId: {
    type: String,
  },
  userIdSend: {
    type: String,
  },
  userIdReceive: {
    type: String,
  },
  content: {
    type: String,
  },
});

const Message = mongose.model("Message", MessSchema);
module.exports = Message;
