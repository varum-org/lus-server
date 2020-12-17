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
      return res.json({
        success: true,
        data: {},
        status_code: 200,
        messages: "Thành công",
      });
    } else {
      return res.status(500).json({
        success: false,
        data: {},
        status_code: 500,
        messages: "Thất bại",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      data: {},
      status_code: 401,
      messages: "Thất bại",
    });
  }
};
