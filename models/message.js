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
  created_date: {
    type: Date,
    default: Date.now(),
  },
  is_read: {
    type: Number,
    default: 0,
  },
});

const Message = mongose.model("Message", MessSchema);
module.exports = Message;
