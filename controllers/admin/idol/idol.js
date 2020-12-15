const Idol = require("../../../models/idol");
const User = require("../../../models/user");

const bcrypt = require("bcryptjs");

const cloudinary = require("../../../config/cloudinary");
const fs = require("fs");

const options = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

exports.list = async (req, res) => {
  const results = [];
  const idols = await Idol.find().sort({ nick_name: 1 });
  for (index in idols) {
    const user = await User.findOne({ _id: idols[index].user_id });
    let item = {
      id: idols[index].user_id,
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

  res.render("admin/idols/idols.hbs", {
    layout: "admin/layouts/main.hbs",
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
};

exports.create = async (req, res) => {
  const uploader = async (path) => await cloudinary.uploader.upload(path);
  const urls = [];
  const {
    email,
    password,
    password_confirmation,
    user_name,
    phone,
    gender,
    birthday,
    address,
    nick_name,
    relationship,
    description,
    // services,
  } = req.body;

  const user_exist = await User.findOne({ email: email });
  if (password != password_confirmation) {
    return res.send("Password not match");
  }
  if (user_exist) {
    return res.send("User already exist");
  }

  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(`${newPath.public_id}.${newPath.format}`);
    fs.unlinkSync(path);
  }

  let gender_parse = 0;
  switch (gender) {
    case "Nam":
      gender_parse = 1;
      break;
    case "Nữ":
      gender_parse = 2;
      break;
    case "Khác":
      gender_parse = 0;
      break;
    default:
      break;
  }

  bcrypt.genSalt(10, (_, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (!err) {
        const user = new User({
          email: email,
          password: hash,
          role_id: 2,
          email_active: 1,
          user_name: user_name,
          phone: phone,
          gender: gender_parse,
          birthday: birthday,
          address: address,
          image_path: urls[0],
        });
        user.save((err) => {
          if (!err) {
            const idol = new Idol({
              user_id: user._id,
              nick_name: nick_name,
              address: address,
              relationship: relationship,
              description: description,
              image_gallery: urls,
              // services: services
            });
            idol.save((err) => {
              if (!err) {
                return res.redirect("/admin/idols");
              } else {
                return res.send(err);
              }
            });
          } else {
            return res.send(err);
          }
        });
      }
    });
  });
};

exports.detail = async (req, res) => {
  await Idol.findOne({ user_id: req.params.id }, async (err, data) => {
    if (!err) {
      const user = await User.findOne({ _id: data.user_id });
      const idol = {
        id: data.user_id,
        email: user.email,
        birthday: user.birthday.toLocaleString().split(",")[0],
        nick_name: data.nick_name,
        address: data.address,
        relationship: data.relationship,
        description: data.description ? data.description : "",
        rating: data.rating,
        images: data.image_gallery,
        status: data.status,
        user_name: user.user_name,
        phone: user.phone,
        gender: user.gender == 0 ? "Khác" : user.gender == 1 ? "Nam" : "Nữ",
      };

      res.render("admin/idols/idol_update.hbs", {
        layout: "admin/layouts/main.hbs",
        title: "Idol Detail",
        idol: idol,
        services: data.services,
        images: data.image_gallery,
      });
    }
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const {
    user_name,
    phone,
    birthday,
    nick_name,
    address,
    relationship,
    description,
    rating,
    gender,
  } = req.body;
  let gender_parse = gender == "Khác" ? 0 : gender == "Nam" ? 1 : 2;
  const idol = await Idol.findOne({ user_id: id });
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
  if (idol) {
    idol.nick_name = nick_name;
    idol.address = address;
    idol.relationship = relationship;
    idol.description = description;
    idol.rating = rating;
    user.save((err) => {
      if (!err) {
        idol.save((err) => {
          if (!err) {
            return res.redirect("/admin/idols");
          } else {
            return res.send(err);
          }
        });
      } else {
        res.send(err);
      }
    });
  }
};

exports.delete = async (req, res) => {
  const url = `${process.env.APP_URL}/admin/idols`;
  const id = req.body.id;

  await Idol.findOneAndDelete({ user_id: id }, async (err) => {
    if (!err) {
      await User.findOneAndUpdate({ _id: id }, { role_id: 1 }, (err) => {
        if (!err) {
          return res.send(url);
        }
      });
    }
  });
};
