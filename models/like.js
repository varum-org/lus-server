const mongose = require("mongoose");

const LikeSchema = new mongose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  idol_id: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const Like = mongose.model("Like", LikeSchema);
module.exports = Like;
