const mongose = require("mongoose");

const IdolSchema = new mongose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  nick_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  relationship: {
    type: String,
  },
  status: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  image_gallery: {
    type: Array,
    required: true,
  },
  rent_time_total: {
    type: Number,
    default: 0,
  },
  rating_total: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  rent_total: {
    type: Number,
    default: 0,
  },
  rent_total_accepted: {
    type: Number,
    default: 0,
  },
  completion_rate: {
    type: Number,
    default: 0,
  },
});

const Idol = mongose.model("Idol", IdolSchema);
module.exports = Idol;
