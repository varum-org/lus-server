module.exports = {
  handleSuccess(res, idol, msg) {
    return res.status(200).json({
      success: true,
      data: idol,
      status_code: 200,
      messages: msg,
    });
  },
  handleList(res, idols, msg) {
    return res.status(200).json({
      success: true,
      data: idols,
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
