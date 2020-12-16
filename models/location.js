const mongose = require("mongoose");

const LocationSchema = new mongose.Schema({
  user_id: {
    type: String,
  },
  name: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longtitude: {
    type: Number,
  },
});

const Location = mongose.model("Location", LocationSchema);
module.exports = Location;
