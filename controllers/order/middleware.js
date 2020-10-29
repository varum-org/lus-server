module.exports = {
  handleSuccess(res, order, msg) {
    return res.status(200).json({
      success: true,
      data: {
        user_id: order.user_id,
        user_email: order.user_email,
        user_phone: order.user_phone,
        user_name: order.user_name,
        user_address: order.user_address,
        status: order.status,
        idol_id: order.idol_id,
        total: order.total,
        payment_method: order.payment_method,
        start_date: order.start_date,
        note: order.note,
      },
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
  handleFailed(res, msg) {
    return res.status(500).json({
      success: false,
      data: {},
      status_code: 500,
      messages: msg,
    });
  },
};
