module.exports = {
  handleSuccess(res, idol, msg) {
    return res.status(200).json({
      success: true,
      data: {
        nick_name: idol.nick_name,
        address: idol.address,
        relationship: idol.relationship,
        description: idol.description,
        image_gallery: idol.image_gallery,
        services: idol.services,
      },
      status_code: 200,
      messages: msg,
    });
  },
  handleList(res, idol, msg) {
    return res.status(200).json({
      success: true,
      data: idol,
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
