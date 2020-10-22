module.exports = {
  handleList(res, cart, msg) {
    return res.json({
      success: true,
      data: cart,
      status_code: 200,
      messages: msg,
    });
  },
  handleSuccess(res, cart, msg) {
    return res.json({
      success: true,
      data: {
        _id: cart._id,
        user_id: cart.user_id,
        idol_id: cart.idol_id,
      },
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
