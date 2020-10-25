module.exports = {
  handleSuccess(res, services, msg) {
    return res.json({
      success: true,
      data: services,
      status_code: 200,
      messages: msg,
    });
  },
  handleFailed(res, msg) {
    return res.json({
      success: false,
      data: {},
      status_code: 500,
      messages: msg,
    });
  },
};
