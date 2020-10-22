const { check } = require("express-validator");

module.exports = {
  requireUserIdCart: check("user_id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("user_id must be a valid id")
    .custom(async (user_id) => {
      if (!user_id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("user_id not match!");
      }
    }),
  requireIdolIdCart: check("idol_id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("user_id must be a valid id")
    .custom(async (idol_id) => {
      if (!idol_id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("idol_id not match!");
      }
    }),
};
