const mongose = require("mongoose");

const OrderDetailSchema = new mongose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  service_code: {
    type: Number,
    required: true,
  },
  service_name: {
    type: String,
  },
  service_price: {
    type: Number,
    required: true,
  },
  hour: {
    type: Number,
    required: true,
  },
});

const OrderDetail = mongose.model("OrderDetail", OrderDetailSchema);
module.exports = OrderDetail;
