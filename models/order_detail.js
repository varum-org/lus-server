const mongose = require("mongoose");

const OrderDetailSchema = new mongose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  idol_id: {
    type: String,
    required: true,
  },
  services: {
    type: Array,
    required: true
  },
});

const OrderDetail = mongose.model("OrderDetail", OrderDetailSchema);
module.exports = OrderDetail;
