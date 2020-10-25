const Order = require("../../models/order");
const OrderDetail = require("../../models/order_detail");
const Wallet = require("../../models/wallet");
const { handleSuccess, handleFailed } = require("./middleware");

exports.add = async (req, res) => {
  const {
    user_id,
    user_email,
    user_phone,
    user_name,
    user_address,
    idol_id,
    total,
    payment_method,
    start_date,
    note,
    services,
  } = req.body;

  const wallet = await Wallet.findOne({ user_id: user_id });
  if (wallet && wallet.balance >= total) {
    const order = new Order({
      user_id: user_id,
      user_email: user_email,
      user_phone: user_phone,
      user_name: user_name,
      user_address: user_address,
      idol_id: idol_id,
      total: total,
      payment_method: payment_method,
      status: 0,
      start_date: start_date,
      note: note,
    });
    order.save((err, orderResult) => {
      if (!err) {
        const order_detail = new OrderDetail({
          order_id: orderResult._id,
          idol_id: idol_id,
          services: services,
        });
        order_detail.save((err) => {
          if (!err) {
            wallet.balance = wallet.balance - total;
            wallet.save((err) => {
              if (!err) {
                const msg = "Order success";
                return handleSuccess(res, orderResult, msg);
              } else {
                return handleFailed(res, err);
              }
            });
          } else {
            return handleFailed(res, err);
          }
        });
      }
    });
  } else {
    const msg =
      "Balance in your wallet not enough. Please top up your account!";
    return handleFailed(res, msg);
  }
};

exports.delete = async (req, res) => {
  const { order_id } = req.body;
  const order = await Order.findOne({ _id: order_id });
  if (order && order.status == 0) {
    await Order.findOneAndDelete({ _id: order_id }, (err, result) => {
      if (!err) {
        const msg = "Delete order success";
        return handleSuccess(res, result, msg);
      }
    });
  } else {
    const msg = "Delete order failure";
    return handleFailed(res, msg);
  }
};

exports.update = async (req, res) => {
  const { order_id, status } = req.body;
  const order = await Order.findOne({ _id: order_id });
  if (order) {
    order.status = status;
    order.save((err, result) => {
      if (!err) {
        const msg = "Update order success";
        return handleSuccess(res, result, msg);
      } else {
        const msg = "Update order failure";
        return handleFailed(res, msg);
      }
    });
  } else {
    const msg = "Update order failure";
    return handleFailed(res, msg);
  }
};
