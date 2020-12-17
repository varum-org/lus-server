module.exports = {
  handleSuccess(res, order, msg) {
    return res.status(200).json({
      success: true,
      data: order,
      status_code: 200,
      messages: msg,
    });
  },
  handleList(res, orders, msg) {
    return res.status(200).json({
      success: true,
      data: orders,
      status_code: 200,
      messages: msg,
    });
  },
  handleFailed(res, msg, code) {
    return res.status(code).json({
      success: false,
      data: {},
      status_code: code,
      messages: msg,
    });
  },
};
