const Wallet = require("../../models/wallet");
const User = require("../../models/user");

exports.add = async (req, res) => {
  const coin = req.body.coin ? req.body.coin : 0;
  const token = req.header("authorization");

  const user = await User.findOne({ token: token });
  if (user) {
    const wallet = await Wallet.findOne({ user_id: user._id });
    if (wallet) {
      wallet.balance = wallet.balance + coin;
      wallet.save();
      return res.json("Thành công");
    } else {
      return res.json("Thất bại");
    }
  } else {
    return res.json("Thất bại");
  }
};
