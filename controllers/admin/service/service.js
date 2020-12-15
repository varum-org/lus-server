const Service = require("../../../models/service");

exports.list = async (req, res) => {
  const services = await Service.find();
  if (services) {
    res.render("admin/services/services.hbs", {
      layout: "admin/layouts/main.hbs",
      title: "Service",
      services: services.map((dat, index) => ({
        ...dat.toJSON(),
        noNum: index + 1,
      })),
    });
  }
};
