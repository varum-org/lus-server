const mongose = require("mongoose");

const OrderSchema = new mongose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  idol_id: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
  },
  user_phone: {
    type: Number,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  user_address: {
    type: String,
    required: true,
  },
  coupon: {
    type: String,
  },
  discount: {
    type: Number,
  },
  payment_method: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default: 0,
  },
  start_date: {
    type: Date,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
  amount: {
    type: Number,
    required: true
  },
  note: {
    type: String,
  },
});

const Order = mongose.model("Order", OrderSchema);
module.exports = Order;
