const Service = require("../../../models/service");
const cloudinary = require("../../../config/cloudinary");
const fs = require("fs");

exports.list = async (req, res) => {
  const services = await Service.find();
  if (services) {
    res.render("admin/services/services.hbs", {
      layout: "admin/layouts/main.hbs",
      title: "Service",
      active: { Service: true },
      services: services.map((dat, index) => ({
        ...dat.toJSON(),
        noNum: index + 1,
      })),
    });
  }
};

exports.detail = async (req, res) => {
  const id = req.params.id;
  const service = await Service.findOne({ _id: id });
  const serviceData = {
    id: service._id,
    service_code: service.service_code,
    service_name: service.service_name,
    service_description: service.service_description,
    service_image_path: service.service_image_path,
  };
  if (service) {
    res.render("admin/services/service_update.hbs", {
      layout: "admin/layouts/main.hbs",
      title: "Service Detail",
      active: { Service: true },
      service: serviceData,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const { service_code, service_name, service_description } = req.body;

  const uploader = async (path) => await cloudinary.uploader.upload(path);
  const file = req.file;
  let url = null;
  if (file) {
    const { path } = file;
    const newPath = await uploader(path);

    url = `${newPath.public_id}.${newPath.format}`;
    fs.unlinkSync(path);
    const service = await Service.findOneAndUpdate(
      { _id: id },
      {
        service_code: service_code,
        service_name: service_name,
        service_description: service_description,
        service_image_path: url,
      }
    );
    service.save((err) => {
      if (!err) {
        return res.redirect("/admin/services");
      } else {
        return res.send(err);
      }
    });
  } else {
    const service = await Service.findOneAndUpdate(
      { _id: id },
      {
        service_code: service_code,
        service_name: service_name,
        service_description: service_description,
      }
    );
    service.save((err) => {
      if (!err) {
        return res.redirect("/admin/services");
      } else {
        return res.send(err);
      }
    });
  }
};

exports.delete = async (req, res) => {
  const url = `${process.env.APP_URL}/admin/services`;
  const id = req.body.id;
  await Service.findOneAndDelete({ _id: id }, async (err) => {
    if (!err) {
      return res.send(url);
    }
  });
};

exports.get_create = async (req, res) => {
  return res.render("admin/services/service_create.hbs", {
    layout: "admin/layouts/main.hbs",
    title: "Thêm dịch vụ",
    active: { Service: true },
  });
};

exports.create = async (req, res) => {
  const { service_code, service_name, service_description } = req.body;

  const uploader = async (path) => await cloudinary.uploader.upload(path);
  const file = req.file;

  const { path } = file;
  const newPath = await uploader(path);

  let url = `${newPath.public_id}.${newPath.format}`;
  fs.unlinkSync(path);
  const service = new Service({
    service_code: service_code,
    service_name: service_name,
    service_description: service_description,
    service_image_path: url,
  });
  service.save((err) => {
    if (!err) {
      return res.redirect("/admin/services");
    } else {
      return res.send(err);
    }
  });
};
