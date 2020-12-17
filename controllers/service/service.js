const Service = require("../../models/service");
const { handleSuccess, handleFailed } = require("./middleware");

exports.list = async (req, res) => {
  const services = await Service.find();
  if (services) {
    const msg = "Get list services success";
    return handleSuccess(res, services, msg);
  }

  const msg = "Get list services failure";
  return handleFailed(res, msg);
};

exports.add = async (req, res) => {
  const {
    service_code,
    service_name,
    service_description,
    service_image_path,
  } = req.body;
  const existService = await Service.findOne({ service_code: service_code });
  if (existService) {
    const msg = "Dịch vụ đã tồn tại";
    return handleFailed(res, msg);
  }
  const service = new Service({
    service_code: service_code,
    service_name: service_name,
    service_description: service_description,
    service_image_path: service_image_path,
  });

  service.save((err, docs) => {
    if (err) {
      const msg = "Có lỗi xảy ra. Vui lòng thử lại sau!";
      return handleFailed(res, msg);
    }
    const msg = "Thêm dịch vụ thành công";
    return handleSuccess(res, docs, msg);
  });
};
exports.update = async (req, res) => {
  const { id } = req.params;
  const { service_code } = req.body;
  const service = await Service.findOne({service_code:service_code});
  if (service && service._id != id) {
    const msg = "Mã dịch vụ đã tồn tại!";
    return handleFailed(res, msg);
  }

  await Service.findByIdAndUpdate({ _id: id }, req.body, (err, docs) => {
    if (err) {
      const msg = "Có lỗi xảy ra. Vui lòng thử lại sau!";
      return handleFailed(res, msg);
    } else {
      const msg = "Thêm dịch vụ thành công";
      return handleSuccess(res, docs, msg);
    }
  });
};
