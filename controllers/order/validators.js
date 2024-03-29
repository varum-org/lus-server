const { check } = require("express-validator");
const User = require("../../models/user");
const Idol = require("../../models/idol");
const Service = require("../../models/service");

module.exports = {
  requireOrder: check("user_id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("user_id must be a valid id")
    .custom(async (user_id, { req }) => {
      const { start_date, services } = req.body;
      if (
        !user_id.match(/^[0-9a-fA-F]{24}$/) ||
        !user_id.match(/^[0-9a-fA-F]{24}$/)
      ) {
        throw new Error("id not match!");
      }
      if (
        !user_id ||
        !start_date ||
        !services ||
        start_date.length == 0 ||
        services.length == 0
      ) {
        throw new Error("Do not empty");
      }
      const token = req.header("authorization");
      const user = await User.findOne({ token: token });
      const idol = await Idol.findOne({ user_id: user_id });

      if (!user || !idol) {
        throw new Error("User or Idol not found!");
      }
      for (const key of services) {
        const ser = await Service.findOne({
          service_code: key.service_code,
          service_name: key.service_name,
        });
        if (!ser) {
          throw new Error("services invalid format");
        }
        if (!key.service_code || !key.service_name || !key.service_price) {
          throw new Error("services invalid format");
        }
        if (isNaN(key.service_price) || key.service_price < 1) {
          throw new Error("Service Price must be greater than 0");
        }
      }
    }),
  requireStartDate: check("start_date")
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date"),
  requireOrderUpdate: check("order_id")
    .trim()
    .custom(async (order_id, { req }) => {
      const { status } = req.body;
      if (!order_id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("order_id not match");
      }
      if (isNaN(status)) {
        throw new Error("status must be a number");
      }
    }),
};
