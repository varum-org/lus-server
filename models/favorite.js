const mongose = require("mongoose");

const FavoriteSchema = new mongose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  idol_id: {
    type: String,
    required: true,
  },
});

const Favorite = mongose.model("Favorite", FavoriteSchema);
module.exports = Favorite;
