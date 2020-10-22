const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

module.exports = {
  handleErrors() {
    return async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          success: false,
          data: {},
          status_code: 500,
          messages: errors.errors[0].msg,
        });
      }
      next();
    };
  },
  handleSuccess(res, user, mess) {
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 2592000, // expires in 30 days
    });
    return res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          user_name: user.user_name,
          role_id: user.role_id,
          isActive: user.isActive,
          image_path: user.image_path,
        },
        auth_token: token,
        is_admin: user.role_id == 0 ? true : false,
      },
      status_code: 200,
      messages: mess,
    });
  },
  handleMail(res, msg) {
    return res.json({
      success: true,
      data: {},
      status_code: 200,
      messages: msg,
    });
  },
  handleFailed(res, mess, code) {
    return res.status(code).json({
      success: false,
      data: {},
      status_code: code,
      messages: mess,
    });
  },
};
