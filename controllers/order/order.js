const Order = require("../../models/order");
const OrderDetail = require("../../models/order_detail");
const Wallet = require("../../models/wallet");
const User = require("../../models/user");
const { handleSuccess, handleFailed, handleList } = require("./middleware");
const mongoose = require("mongoose");
const Idol = require("../../models/idol");
const ObjectId = mongoose.Types.ObjectId;

// exports.list = async (req, res) => {
//   const { status } = req.query;
//   const token = req.header("authorization");
//   const user = await User.findOne({ token: token });

//   const orders = await Order.find({ user_id: user._id });
//   const newOrders = [];
//   if (!status) {
//     if (orders) {
//       const msg = "Get list orders success";
//       return handleList(res, orders, msg);
//     }
//   } else if (status == "pending") {
//     for (const key of orders) {
//       if (key.status == 1) {
//         newOrders.push(key);
//       }
//     }
//     const msg = "Get list pending orders success";
//     return handleList(res, newOrders, msg);
//   } else if (status == "approve") {
//     for (const key of orders) {
//       if (key.status == 2) {
//         newOrders.push(key);
//       }
//     }
//     const msg = "Get list approve orders success";
//     return handleList(res, newOrders, msg);
//   } else if (status == "reject") {
//     for (const key of orders) {
//       if (key.status == 3) {
//         newOrders.push(key);
//       }
//     }
//     const msg = "Get list reject orders success";
//     return handleList(res, newOrders, msg);
//   } else if (status == "finish") {
//     for (const key of orders) {
//       if (key.status == 4) {
//         newOrders.push(key);
//       }
//     }
//     const msg = "Get list finish orders success";
//     return handleList(res, newOrders, msg);
//   }
// };

exports.list = async (req, res) => {
  const { status } = req.query;
  const token = req.header("authorization");
  const user = await User.findOne({ token: token });
  if (user) {
    const list_orders = await Order.find({
      idol_email: user.email,
      status: status,
    }).limit(10);

    if (list_orders) {
      const msg = "Get list rent me success";
      return handleList(res, list_orders, msg);
    } else {
      const msg = "Có lỗi xảy ra. Vui lòng thử lại sau";
      return handleFailed(res, msg, 500);
    }
  } else {
    const msg = "Có lỗi xảy ra. Vui lòng thử lại sau";
    return handleFailed(res, msg, 401);
  }
};

exports.list_order_idol = async (req, res) => {
  const { status } = req.query;
  const token = req.header("authorization");
  const user = await User.findOne({ token: token });
  if (user) {
    const list_orders = await Order.find({
      user_email: user.email,
      status: status,
    }).limit(10);

    if (list_orders) {
      const msg = "Get list rent me success";
      return handleList(res, list_orders, msg);
    } else {
      const msg = "Có lỗi xảy ra. Vui lòng thử lại sau";
      return handleFailed(res, msg, 500);
    }
  } else {
    const msg = "Có lỗi xảy ra. Vui lòng thử lại sau";
    return handleFailed(res, msg, 401);
  }
};

exports.add = async (req, res) => {
  const { user_id, start_date, note, services } = req.body;
  const token = req.header("authorization");
  const user = await User.findOne({ token: token });
  const idol = await User.findOne({ _id: user_id });
  const idol_ = await Idol.findOne({ user_id: idol._id });
  const wallet = await Wallet.findOne({ user_id: user._id });

  if (wallet.balance >= getTotalOrder(services)) {
    wallet.balance = wallet.balance - getTotalOrder(services);
    wallet.save();
    const order = new Order({
      user_email: user.email,
      user_phone: user.phone,
      user_name: user.user_name,
      user_address: user.address ? user.address : "",
      user_image: user.image_path,
      idol_email: idol.email,
      idol_user_name: idol.user_name,
      idol_phone: idol.phone,
      idol_address: idol.address,
      idol_image: idol_.image_gallery[0],
      payment_method: "Xu",
      amount: getTotalOrder(services),
      status: 1,
      start_date: start_date,
      note: note,
    });
    order.save(async (err, orderResult) => {
      if (!err) {
        const result = await flattenServices(orderResult._id, services);
        OrderDetail.insertMany(result, (err, docs) => {
          if (!err) {
            const msg = "Thuê thành công";
            return handleSuccess(res, orderResult, msg);
          } else {
            return handleFailed(res, err, 500);
          }
        });
      } else handleFailed(res, err.errors, 500);
    });
  } else {
    const msg = "Xu không đủ. Vui lòng nạp thêm Xu vào tài khoản.";
    return handleFailed(res, msg, 500);
  }
};

exports.update = async (req, res) => {
  const { order_id, status } = req.body;
  const order = await Order.findOne({ _id: order_id });

  const user = await User.findOne({ email: order.user_email });
  const idol = await User.findOne({ email: order.idol_email });

  const user_wallet = await Wallet.findOne({ user_id: user._id });
  const idol_wallet = await Wallet.findOne({ user_id: idol._id });

  if (order && order.status == 4) {
    const msg = "Đơn hàng đã hoàn thành. Không thể cập nhật";
    return handleFailed(res, msg, 404);
  } else if (order && status == 2) {
    order.status = status;
    order.save(async (err, result) => {
      if (!err) {
        const msg = "Cập nhật đơn hàng thành công";
        return handleSuccess(res, result, msg);
      } else {
        const msg = "Có lỗi xảy ra. Vui lòng thử lại sau";
        return handleFailed(res, msg, 500);
      }
    });
  } else if (order && status == 3) {
    order.status = status;
    order.save(async (err, result) => {
      if (!err) {
        user_wallet.balance += order.amount;
        user_wallet.save();
        const msg = "Cập nhật đơn hàng thành công";
        return handleSuccess(res, result, msg);
      } else {
        const msg = "Có lỗi xảy ra. Vui lòng thử lại sau";
        return handleFailed(res, msg, 500);
      }
    });
  } else if (order && status == 4) {
    order.status = status;
    order.save(async (err, result) => {
      if (!err) {
        idol_wallet.balance += order.amount * 0.8;
        idol_wallet.save();
        const msg = "Hoàn thành đơn hàng";
        return handleSuccess(res, result, msg);
      } else {
        const msg = "Có lỗi xảy ra. Vui lòng thử lại sau";
        return handleFailed(res, msg, 500);
      }
    });
  }
};

exports.delete = async (req, res) => {
  const { order_id } = req.params;
  const order = await Order.findOne({ _id: order_id });
  if (order && order.status == 1) {
    await Order.findOneAndDelete({ _id: order_id }, (err, result) => {
      if (!err) {
        const msg = "Delete order success";
        return handleSuccess(res, result, msg);
      }
    });
  } else {
    const msg = "Delete order failure";
    return handleFailed(res, msg, 500);
  }
};

const getTotalOrder = (services) => {
  let sum = 0;
  for (const key in services) {
    sum += services[key].service_price * services[key].hour;
  }
  return sum;
};
const flattenServices = async (order_id, data) => {
  let arr = [];
  data.map((e) => {
    e._id = ObjectId();
    arr.push({
      _id: ObjectId(),
      order_id: order_id,
      service_code: e.service_code,
      service_name: e.service_name,
      service_price: e.service_price,
      hour: e.hour,
    });
  });
  return arr;
};
