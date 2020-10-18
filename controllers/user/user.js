const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto-random-string");
const mail = require("../../config/send_email");
const { handleSuccess, handleFailed } = require("./middleware");

// Check login
exports.checkLogin = async (req, res) => {
  const { email, device_token } = req.body;
  await User.findOne({ email: email }, (_, user) => {
    user.device_token = device_token;
    user.save((err, user) => {
      if (!err) {
        const mess = "Login Successfully!";
        handleSuccess(res, user, mess);
      } else {
        handleFailed(res, err, 500);
      }
    });
  });
};

// Check Register
exports.checkRegister = async (req, res) => {
  const { id, email, password, user_name, phone } = req.body;
  const user = await User.findOne({ _id: id });

  if (user) {
    bcrypt.genSalt(10, (_, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (!err) {
          user.email = email;
          user.password = hash;
          user.user_name = user_name;
          user.phone = phone;
          user.confirm_email_code = null;
          user.confirm_email_expires = null;
          user.save((err, user) => {
            if (!err) {
              const mess = "Register Successfully!";
              handleSuccess(res, user, mess);
            } else {
              handleFailed(res, err, 500);
            }
          });
        }
      });
    });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email } = req.body;
  const code = crypto({ length: 6, type: "numeric" });

  const newUser = new User();
  newUser.confirm_email_code = code;
  newUser.confirm_email_expires = Date.now() + 600000;

  await newUser.save((err, user) => {
    if (!err) {
      mail.sendEmail(email, res, user, code);
    } else {
      handleFailed(res, err, 500);
    }
  });
};

exports.userInfomation = async (req, res) => {
  const { id } = req.body;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const user = await User.findOne({ _id: id });
    if (user) {
      const mess = "Get information successfully";
      handleSuccess(res, user, mess);
    } else {
      const mess = "Id not found!";
      handleFailed(res, mess, 404);
    }
  } else {
    const mess = "Id invalid";
    handleFailed(res, mess, 500);
  }
};
