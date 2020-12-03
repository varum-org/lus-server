module.exports = {
  handleSuccess(res, room, msg) {
    return res.status(200).json({
      success: true,
      data: room,
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
