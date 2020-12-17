const mongose = require("mongoose");

const OrderDetailSchema = new mongose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  idol_email: {
    type: String,
    required: true
  },
  idol_user_name: {
    type: String,
    required: true
  },
  idol_phone: {
    type: String,
    required: true
  },
  idol_address: {
    type: String,
  },
  service_code: {
    type: Number,
    required: true,
  },
  service_price: {
    type: Number,
    required: true,
  },
  hour: {
    type: Number,
    required: true
  }
});

const OrderDetail = mongose.model("OrderDetail", OrderDetailSchema);
module.exports = OrderDetail;
