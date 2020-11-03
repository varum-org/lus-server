const Order = require("../../models/order");
const OrderDetail = require("../../models/order_detail");
const Wallet = require("../../models/wallet");
const User = require("../../models/user");
const { handleSuccess, handleFailed, handleList } = require("./middleware");

exports.list = async (req, res) => {
  const { status } = req.query;
  const token = req.header("authorization");
  const user = await User.findOne({ token: token });

  const orders = await Order.find({ user_id: user._id });
  const newOrders = [];
  if (!status) {
    if (orders) {
      const msg = "Get list orders success";
      return handleList(res, orders, msg);
    }
  } else if (status == "pending") {
    for (const key of orders) {
      if (key.status == 0) {
        newOrders.push(key);
      }
    }
    const msg = "Get list pending orders success";
    return handleList(res, newOrders, msg);
  } else if (status == "approve") {
    for (const key of orders) {
      if (key.status == 1) {
        newOrders.push(key);
      }
    }
    const msg = "Get list approve orders success";
    return handleList(res, newOrders, msg);
  } else if (status == "reject") {
    for (const key of orders) {
      if (key.status == 2) {
        newOrders.push(key);
      }
    }
    const msg = "Get list reject orders success";
    return handleList(res, newOrders, msg);
  } else if (status == "finish") {
    for (const key of orders) {
      if (key.status == 3) {
        newOrders.push(key);
      }
    }
    const msg = "Get list finish orders success";
    return handleList(res, newOrders, msg);
  }
};

exports.list_for_idol = async (req, res) => {
  const token = req.header("authorization");
  const user = await User.findOne({ token: token });

  const list_orders = await Order.find({ idol_id: user._id });
  if (list_orders) {
    const msg = "Get list rent me success";
    return handleList(res, list_orders, msg);
  }
};

exports.add = async (req, res) => {
  const {
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

  const token = req.header("authorization");
  const user = await User.findOne({ token: token });

  const order = new Order({
    user_id: user._id,
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
          const msg = "Order success";
          return handleSuccess(res, orderResult, msg);
        } else {
          return handleFailed(res, err);
        }
      });
    }
  });
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
  const wallet = await Wallet.findOne({ user_id: order.user_id });

  if (order && status == 1) {
    if (wallet.balance >= order.total) {
      order.status = status;
      order.save(async (err, result) => {
        if (!err) {
          wallet.balance = wallet.balance - total;
          wallet.save();
          const msg = "Update order success";
          return handleSuccess(res, result, msg);
        } else {
          const msg = "Update order failure";
          return handleFailed(res, msg);
        }
      });
    } else {
      await Order.findOneAndDelete({ _id: order_id }, (err) => {
        if (!err) {
          const msg = "Customer not enough Xu. Order has been delete";
          return handleFailed(res, msg);
        }
      });
    }
  } else {
    order.status = status;
    order.save(async (err, result) => {
      if (!err) {
        const msg = "Update order success";
        return handleSuccess(res, result, msg);
      } else {
        const msg = "Update order failure";
        return handleFailed(res, msg);
      }
    });
  }
};
