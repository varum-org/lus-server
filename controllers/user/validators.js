const { check } = require("express-validator");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email"),
  requireEmailLogin: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        throw new Error("Email not found!");
      }
    }),
  requirePasswordLogin: check("password")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters")
    .custom(async (password, { req }) => {
      const user = await User.findOne({ email: req.body.email });
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error("Invalid password");
      }
    }),
  requireEmailRegister: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error("Email in use!");
      }
    }),
  requirePasswordRegister: check("password")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters"),
  requireVerifyCode: check("confirm_email_code")
    .trim()
    .custom(async (confirm_email_code, { req }) => {
      const user = await User.findOne({ _id: req.body.id });
      if (!user) {
        throw new Error(`Id not found!`);
      } else if (user.confirm_email_expires < Date.now()) {
        throw new Error("Verification code has expired");
      } else if (user.confirm_email_code != confirm_email_code) {
        throw new Error("Invalid Code");
      }
    }),
  requireId: check("id")
    .trim()
    .isLength({ min: 1 })
    .custom(async (id) => {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("id not match!");
      }
    }),
};
