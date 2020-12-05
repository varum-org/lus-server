const { check } = require("express-validator");
const Service = require("../../models/service");

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
    .isLength({ min: 1, max: 6 })
    .withMessage("nick_name must be between 1 and 6 characters"),
  requireAddress: check("address")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("address must be between 1 and 20 characters"),
  requireImageGallery: check("image_gallery")
    .isArray()
    .withMessage("image_gallery invalid format")
    .custom(async (image_gallery) => {
      if (image_gallery.length == 0) {
        throw new Error("image_gallery invalid format");
      }
      for (const key of image_gallery) {
        if (typeof key != "string") {
          throw new Error("image_gallery invalid format");
        }
      }
    }),
  requireServices: check("services")
    .isArray()
    .withMessage("services invalid format")
    .custom(async (services) => {
      if (services.length == 0) {
        throw new Error("services invalid format");
      }
      for (const key of services) {
        const ser = await Service.findOne({
          service_code: key.service_code,
          service_name: key.service_name,
        });
        if (!ser) {
          throw new Error("service_name or service_code invalid");
        }
        if (!key.service_code || !key.service_name || !key.service_price) {
          throw new Error("services invalid format");
        }
      }
    }),
  search: check("name")
    .trim()
    .custom(async (_, { req }) => {
      const { rating } = req.query;
      if (rating)
        if (isNaN(rating)) {
          throw new Error("Rating must be a number");
        }
    }),
  images: check("image_gallery").custom(async (_, { req }) => {
    const images = req.files;
    if (images.length == 0) {
      throw new Error("image_gallery not null");
    }
  }),
};
