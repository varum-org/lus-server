const { check } = require("express-validator");

module.exports = {
  requireUserId: check("user_id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("user_id must be a valid id")
    .custom(async (user_id) => {
      if (!user_id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("user_id not match!");
      }
    }),
  requireNickName: check("nick_name")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("nick_name must be between 1 and 20 characters"),
};
