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

  res.render("admin/home/home.hbs", {
    layout: "admin/layouts/main.hbs",
    title: "Dashboard",
    active: { Dashboard: true },
    totalAmount: total.length > 0 ? total[0].amount : 0,
    monthAmount: month.length > 0 ? month[0].amount : 0,
    totalIdol: totalIdol,
    //   yourname: req.user.fullname,
    //   avatar: req.user.avatar,
  });
};
