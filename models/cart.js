const mongose = require("mongoose");

const CartSchema = new mongose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  idol_id: {
    type: String,
    required: true,
  },
});

const Cart = mongose.model("Cart", CartSchema);
module.exports = Cart;
