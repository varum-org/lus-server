const express = require("express");
const Idol = require("../models/idol");
const User = require("../models/user");
const Order = require("../models/order");
const router = express.Router();

const options = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

router.get("/dashboard", async (req, res) => {
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

  res.render("home/home.hbs", {
    title: "Dashboard",
    totalAmount: total.length > 0 ? total[0].amount : 0,
    monthAmount: month.length > 0 ? month[0].amount : 0,
    totalIdol: totalIdol,
    //   yourname: req.user.fullname,
    //   avatar: req.user.avatar,
  });
});

router.get("/idol", async (req, res) => {
  const results = [];
  const idols = await Idol.find().sort({ nick_name: 1 });
  for (index in idols) {
    const user = await User.findOne({ _id: idols[index].user_id });
    let item = {
      id: idols[index]._id,
      index: parseInt(index) + 1,
      avatar: idols[index].image_gallery[0],
      name: idols[index].nick_name,
      birthday: user.birthday
        ? user.birthday.toLocaleDateString("vi-VN", options)
        : "Chưa cập nhật",
      address: idols[index].address,
      rating: idols[index].rating,
      status: idols[index].status,
    };
    results.push(item);
  }

  res.render("idols/idols.hbs", {
    title: "Idol",
    idols: results,
    helpers: {
      ifCond: function (v1, v2, options) {
        if (v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      forLoop: function (n, block) {
        var accum = "";
        for (var i = 0; i < n; ++i) accum += block.fn(i);
        return accum;
      },
    },
  });
});

router.get("/idol/:id", async (req, res) => {
  await Idol.findOne({ _id: req.params.id }, async (err, data) => {
    if (!err) {
      const user = await User.findOne({ _id: data.user_id });
      const idol = {
        email: user.email,
        nick_name: data.nick_name,
        address: data.address,
        relationship: data.relationship,
        description: data.description,
        rating: data.rating,
        images: data.image_gallery,
        status: data.status,
      };

      res.render("idols/idol_update.hbs", {
        title: "Idol Detail",
        idol: idol,
        services: data.services,
        images: data.image_gallery,
      });
    }
  });
});
router.get("/user", async (reg, res) => {
  const users = await User.find().sort({ created_date: -1 });
  res.render("users/user", {
    title: "User",
    users: users.map((dat, index) => ({
      ...dat.toJSON(),
      created_date: dat.created_date.toLocaleDateString("vi-VN", options),
      noNum: index + 1,
    })),
    helpers: {
      ifCond: function (v1, v2, options) {
        if (v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
    },
  });
});
module.exports = router;
