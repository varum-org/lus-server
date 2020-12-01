const { check } = require("express-validator");
const User = require("../../models/user");
const Idol = require("../../models/idol");
const Service = require("../../models/service");

module.exports = {
  requireOrder: check("idol_id")
    .trim()
    .isLength({ min: 1 })
    .withMessage("idol_id must be a valid id")
    .custom(async (idol_id, { req }) => {
      const { payment_method, start_date, services } = req.body;
      if (
        !idol_id.match(/^[0-9a-fA-F]{24}$/) ||
        !idol_id.match(/^[0-9a-fA-F]{24}$/)
      ) {
        throw new Error("id not match!");
      }
      if (
        !idol_id ||
        !payment_method ||
        !start_date ||
        !services ||
        payment_method.length == 0 ||
        start_date.length == 0 ||
        services.length == 0
      ) {
        throw new Error("Do not empty");
      }
      const token = req.header("authorization");
      const user = await User.findOne({ token: token });
      const idol = await Idol.findOne({ _id: idol_id });
      if (!user || !idol) {
        throw new Error("User or Idol not found!");
      }
      if (payment_method != "Lus Xu") {
        throw new Error("Payment method must be Lus Xu");
      }
      for (const key of services) {
        const ser = await Service.findOne({
          service_code: key.service.service_code,
          service_name: key.service.service_name,
        });
        if (!ser) {
          throw new Error("services invalid format");
        }
        if (
          !key.service.service_code ||
          !key.service.service_name ||
          !key.service.service_price
        ) {
          throw new Error("services invalid format");
        }
        if (isNaN(key.service.service_price) || key.service.service_price < 1) {
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
