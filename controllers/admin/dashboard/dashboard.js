const Order = require("../../../models/order");
const Idol = require("../../../models/idol");

exports.dashboard = async (req, res) => {
  const start = new Date();
  start.setMonth(start.getMonth() - 1);

  const total = await Order.aggregate([
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

  const month = await Order.aggregate([
    {
      $match: {
        $and: [
          {
            created_date: {
              $gte: start,
              $lt: new Date(),
            },
          },
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

  const totalIdol = await Idol.find().countDocuments();
  const totalOrder = await Order.find().countDocuments();
  const total_format = new Intl.NumberFormat("vi-VN", {
    maximumSignificantDigits: 3,
  }).format(total.length > 0 ? total[0].amount * 1000 : 0);
  const month_format = new Intl.NumberFormat("vi-VN", {
    maximumSignificantDigits: 3,
  }).format(month.length > 0 ? month[0].amount * 1000 : 0);

  res.render("admin/home/home.hbs", {
    layout: "admin/layouts/main.hbs",
    title: "Dashboard",
    active: { Dashboard: true },
    totalAmount: total_format,
    monthAmount: month_format,
    totalIdol: totalIdol,
    totalOrder: totalOrder,
    //   yourname: req.user.fullname,
    //   avatar: req.user.avatar,
  });
};
