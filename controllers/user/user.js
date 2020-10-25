const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto-random-string");
const mail = require("../../config/send_email");
const { handleSuccess, handleFailed } = require("./middleware");
const Wallet = require("../../models/wallet");

// Check login
exports.login = async (req, res) => {
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
exports.register = async (req, res) => {
  const { email, password, user_name, phone } = req.body;

  bcrypt.genSalt(10, (_, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (!err) {
        const code = crypto({ length: 6, type: "numeric" });
        const newUser = new User({
          email: email,
          password: hash,
          user_name: user_name,
          phone: phone,
          email_code: code,
          email_code_expires: Date.now() + 600000,
        });

        newUser.save((err, _) => {
          if (!err) {
            return mail.sendEmail(email, res, code);
          } else {
            return handleFailed(res, err, 500);
          }
        });
      }
    });
  });
};

exports.verifyEmail = async (req, res) => {
  const { email, email_code } = req.body;
  const userArr = await User.find({ email: email });

  const user = userArr[userArr.length - 1];
  if (
    user &&
    email_code == user.email_code &&
    Date.now() < user.email_code_expires
  ) {
    user.save(async (err, docs) => {
      if (!err) {
        createWallet(res, docs._id, email);

        docs.email_active = 1;
        docs.email_code = null;
        docs.email_code_expires = null;
        docs.save(async (err, succ) => {
          if (!err) {
            await User.deleteMany({ email: email, email_active: 0 });
            const mess = "Verify email success!";
            return handleSuccess(res, succ, mess);
          }
        });
      } else {
        const mess = "Verify email failure! 111";
        return handleFailed(res, mess);
      }
    });
  } else {
    const mess = "Verify email failure!";
    return handleFailed(res, mess);
  }
};

exports.resetEmailCode = async (req, res) => {
  const { email } = req.body;
  const userArr = await User.find({ email: email });

  const code = crypto({ length: 6, type: "numeric" });
  const user = userArr[userArr.length - 1];

  user.email_code = code;
  user.email_code_expires = Date.now() + 600000;
  user.save((err, docs) => {
    if (!err) {
      const msg = "Your code has been reset"
      return handleSuccess(res, docs, msg);
    }
    return res.json(err);
  });
};

const createWallet = async (res, user_id, email) => {
  const user_wallet = new Wallet({
    user_id: user_id,
    balance: 0,
  });
  user_wallet.save((err, docs) => {
    console.log("Wallet has been for user_id -> Bug")
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
