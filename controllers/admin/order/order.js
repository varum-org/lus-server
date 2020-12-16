const Order = require("../../../models/order");

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
          ? "Thành công"
          : dat.status == 3
          ? "Đã huỷ"
          : "Hoàn thành",
    })),
    order_amount: amount.length > 0 ? amount[0].amount : 0,
  });
};
