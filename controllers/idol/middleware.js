module.exports = {
  handleSuccess(res, idol, msg) {
    return res.json({
      success: true,
      data: {
        nick_name: idol.nick_name,
        address: idol.address,
        relationship: idol.relationship,
        description: idol.description,
        image_gallery: idol.image_gallery,
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
