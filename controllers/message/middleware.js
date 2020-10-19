module.exports = {
  handleSuccess(res, room, msg) {
    return res.json({
      success: true,
      data: {
        userIdSend: room.userIdSend,
        userNameSend: room.userNameSend,
        userIdReceive: room.userIdReceive,
        userNameReceive: room.userNameReceive,
        roomId: room.roomId,
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
