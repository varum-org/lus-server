const Cart = require("../../models/cart");
const Idol = require("../../models/idol");
const { handleList, handleSuccess, handleFailed } = require("./middleware");

exports.list = async (req, res) => {
  const { user_id } = req.body;
  const cart = await Cart.find({ user_id: user_id });
  if (cart) {
    const msg = "List Cart successfully!";
    return handleList(res, cart, msg);
  }
  const msg = "List Cart failure!";
  return handleFailed(res, msg);
};

exports.add = async (req, res) => {
  const { user_id, idol_id } = req.body;

  const idol = await Idol.findOne({ user_id: idol_id });
  if (idol && idol.status === 0) {
    const user_cart = await Cart.findOne({
      user_id: user_id,
      idol_id: idol_id,
    });
    if (user_cart) {
      const msg = "You liked this Idol!";
      return handleFailed(res, msg);
    }

    const cart = new Cart({
      user_id: user_id,
      idol_id: idol_id,
    });

    cart.save((err, docs) => {
      if (err) {
        const msg = "Add Idol to Cart failure!";
        return handleFailed(res, msg);
      }
      const msg = "Add Idol to Cart successfully!";
      return handleSuccess(res, docs, msg);
    });
  } else {
    const msg = "Idol are not available";
    return handleFailed(res, msg);
  }
};

exports.delete = async (req, res) => {
  const { user_id, idol_id } = req.body;

  await Cart.findOneAndDelete({ user_id: user_id, idol_id: idol_id }, (err) => {
    if (!err) {
      const msg = "Delete Idol from Cart successfully!";
      return handleFailed(res, msg);
    }
    const msg = "Delete Idol from Cart failure!";
    return handleFailed(res, msg);
  });
};
