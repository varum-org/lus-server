const { check } = require("express-validator");
const Service = require("../../models/service");

module.exports = {
  requireServiceCode: check("service_code")
    .trim()
    .custom(async (code) => {
      const existingCode = await Service.findOne({ service_code: code });
      if (existingCode) {
        throw new Error("Code already exist!");
      }
    }),
};
