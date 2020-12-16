const User = require("../../../models/user");
const Idol = require("../../../models/idol");

const options = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

exports.get_signin = async (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/admin/dashboard");
  res.render("admin/users/sign_in.hbs", {
    layout: "admin/layouts/index.hbs",
    message: req.flash("message"),
  });
};

exports.logout = async (req, res) => {
  req.logout();
  res.redirect("/admin");
};

exports.list = async (req, res) => {
  const users = await User.find().sort({ created_date: -1 });
  res.render("admin/users/user", {
    layout: "admin/layouts/main.hbs",
    title: "User",
    active: { User: true },
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
};

exports.detail = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  const userData = {
    id: user._id,
    email: user.email,
    birthday: user.birthday.toLocaleString().split(",")[0],
    avatar: user.image_path,
    user_name: user.user_name,
    address: user.address,
    phone: user.phone,
    gender: user.gender == 0 ? "Khác" : user.gender == 1 ? "Nam" : "Nữ",
  };

  res.render("admin/users/user_update.hbs", {
    layout: "admin/layouts/main.hbs",
    title: "User Detail",
    active: { User: true },
    user: userData,
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const { phone, birthday, address, gender, user_name } = req.body;

  let gender_parse = gender == "Khác" ? 0 : gender == "Nam" ? 1 : 2;
  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      user_name: user_name,
      phone: phone,
      address: address,
      birthday: birthday,
      gender: gender_parse,
    }
  );
  user.save((err) => {
    if (!err) {
      return res.redirect("/admin/users");
    } else {
      return res.send(err);
    }
  });
};

exports.delete = async (req, res) => {
  const url = `${process.env.APP_URL}/admin/users`;
  const id = req.body.id;
  await User.findOneAndDelete({ _id: id }, async (err) => {
    if (!err) {
      await Idol.findOneAndDelete({ user_id: id }, (err) => {
        if (!err) {
          return res.send(url);
        }
      });
    }
  });
};
