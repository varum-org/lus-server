const { check } = require("express-validator");

module.exports = {
  requireUserIdSendMess: check("id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("id must be a valid id")
    .custom(async (userIdSend) => {
      if (!userIdSend.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("id not match!");
      }
    }),
  requireUserIdReceiveMess: check("id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("id must be a valid id")
    .custom(async (userIdReceive) => {
      if (!userIdReceive.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("id not match!");
      }
    }),
};
