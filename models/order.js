const mongose = require("mongoose");

const OrderSchema = new mongose.Schema({
  user_email: {
    type: String,
    required: true,
  },
  user_phone: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  user_address: {
    type: String,
    default: "",
  },
  coupon: {
    type: String,
    default: "",
  },
  discount: {
    type: Number,
    default: 0,
  },
  payment_method: {
    type: String,
    default: "Xu"
  },
  status: {
    type: Number,
    required: true,
    default: 1,
  },
  start_date: {
    type: Date,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
  note: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    required: true,
  }
});

const Order = mongose.model("Order", OrderSchema);
module.exports = Order;
