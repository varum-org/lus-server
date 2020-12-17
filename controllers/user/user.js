const User = require("../../models/user");
const Idol = require("../../models/idol");
const bcrypt = require("bcryptjs");
const crypto = require("crypto-random-string");
const mail = require("../../config/send_email");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const {
  handleSuccess,
  handleFailed,
  handleGetUserSuccess,
} = require("./middleware");
const Wallet = require("../../models/wallet");

// Check login
exports.login = async (req, res) => {
  const { email, device_token } = req.body;
  await User.findOne({ email: email }, (_, user) => {
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 2592000, // expires in 30 days
    });
    user.device_token = device_token;
    user.token = token;
    user.save((err, user) => {
      if (!err) {
        const mess = "Login Successfully!";
        handleSuccess(res, user, mess);
      } else {
        handleFailed(res, err, 401);
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
            return handleFailed(res, err, 401);
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
        await createWallet(docs._id);

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
      }
    });
  } else {
    const mess = "Email code has expires or invalid!";
    return handleFailed(res, mess, 500);
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
      const msg = "Your code has been reset";
      return handleSuccess(res, docs, msg);
    }
    return res.json(err);
  });
};

const createWallet = async (user_id) => {
  const user_wallet = new Wallet({
    user_id: user_id,
    balance: 0,
  });
  user_wallet.save();
};

exports.userInfomation = async (req, res) => {
  const token = req.header("authorization");
  const user = await User.findOne(
    { token: token },
    {
      password: 0,
      device_token: 0,
      token: 0,
      email_code: 0,
      email_code_expires: 0,
    }
  );
  if (user) {
    const mess = "Get information successfully";
    let idol = await Idol.findOne({ user_id: user._id });
    handleGetUserSuccess(res, { user: user, idol: idol }, mess);
  } else {
    const mess = "User not found!";
    handleFailed(res, mess, 401);
  }
};
