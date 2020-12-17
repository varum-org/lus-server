const Order = require("../../../models/order");
const OrderDetail = require("../../../models/order_detail");

const options = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

exports.list = async (req, res) => {
  const orders = await Order.find({ status: 4 }).sort({ created_date: -1 });
  const amount = await Order.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $gte: 4,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: 1,
        amount: { $sum: "$amount" },
      },
    },
  ]);

  res.render("admin/orders/order_success", {
    layout: "admin/layouts/main.hbs",
    title: "Đơn hàng thành công",
    active: { Order_All: true },
    orders: orders.map((dat, index) => ({
      ...dat.toJSON(),
      created_date: dat.created_date.toLocaleDateString("vi-VN", options),
      noNum: index + 1,
      order_status: "Hoàn thành",
    })),
    order_amount: amount.length > 0 ? amount[0].amount : 0,
    helpers: {
      ifCond: function (v1, v2, options) {
        if (v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
    },
  });
};

exports.detail = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  const order_detail = await OrderDetail.find({ order_id: order._id });
  let status_update =
    order.status == 1
      ? "Chờ xác nhận"
      : order.status == 2
      ? "Đã thanh toán"
      : order.status == 3
      ? "Đã huỷ"
      : "Hoàn thành";

  res.render("admin/orders/order_detail", {
    layout: "admin/layouts/main.hbs",
    title: "Chi tiết đơn hàng",
    active: { Order_All: true },
    order: order.toJSON(),
    order_detail: order_detail.map((dat, index) => ({
      ...dat.toJSON(),
    })),
    status: status_update,
  });
};
