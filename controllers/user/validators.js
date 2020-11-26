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
      } else if (existingUser.email_active != 1) {
        throw new Error("Email is not activated");
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
      if (existingUser && existingUser.email_active == 1) {
        throw new Error("Email in use!");
      }
    }),
  requirePasswordRegister: check("password")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters"),
  requireUserNameRegister: check("user_name")
    .trim()
    .isLength({ min: 6, max: 55 })
    .withMessage("Username must be between 6 and 55 characters"),
  requirePhoneRegister: check("phone")
    .trim()
    .isNumeric()
    .withMessage("Phone must be a number")
    .custom(async (phone) => {
      if (phone.length < 10 || phone.length > 11) {
        throw new Error("Phone must be 10 or 11 character");
      }
    }),
  requireVerifyEmail: check("email")
    .trim()
    .custom(async (email) => {
      const userArr = await User.find({ email: email });
      for (const key of userArr) {
        if (key.email_active == 1) {
          throw new Error("Email in use");
        }
      }
    }),
  requireEmailCode: check("email_code")
    .trim()
    .custom(async (email_code) => {
      if (!email_code) {
        throw new Error("email_code invalid");
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
