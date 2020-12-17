const Order = require("../../../models/order");
const Idol = require("../../../models/idol");

const options = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

exports.list = async (req, res) => {
  const orders = await Order.find().sort({ created_date: -1 });
  const amount = await Order.aggregate([
    {
      $group: {
        _id: 1,
        amount: { $sum: "$amount" },
      },
    },
  ]);

  res.render("admin/orders/order", {
    layout: "admin/layouts/main.hbs",
    title: "Order",
    active: { Order_All: true },
    orders: orders.map((dat, index) => ({
      ...dat.toJSON(),
      created_date: dat.created_date.toLocaleDateString("vi-VN", options),
      noNum: index + 1,
      order_status:
        dat.status == 1
          ? "Chờ xác nhận"
          : dat.status == 2
          ? "Đã thanh toán"
          : dat.status == 3
          ? "Đã huỷ"
          : "Hoàn thành",
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
  const idol = await Idol.findOne({ user_id: order.idol_id });
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
    idol: idol.toJSON(),
    status: status_update,
  });
};
