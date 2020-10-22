const { check } = require("express-validator");

module.exports = {
  requireUserIdSendMess: check("userIdSend")
    .trim()
    .isLength({ min: 1 })
    .withMessage("user_id must be a valid id")
    .custom(async (userIdSend) => {
      if (!userIdSend.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("userIdSend not match!");
      }
    }),
  requireUserIdReceiveMess: check("userIdReceive")
    .trim()
    .isLength({ min: 1 })
    .withMessage("user_id must be a valid id")
    .custom(async (userIdReceive) => {
      if (!userIdReceive.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("userIdReceive not match!");
      }
    }),
};
