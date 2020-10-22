const Room = require("../../models/room");
const User = require("../../models/user");
const { v4: uuidv4 } = require("uuid");
const { handleSuccess, handleFailed } = require("./middleware");
const Message = require("../../models/message");

exports.loadAllRoom = async (req, res) => {
  const { userId } = req.body;
  const filter1 = { userIdSend: userId };
  const filter2 = { userIdReceive: userId };

  const getRoom1 = await Room.find(filter1);
  const getRoom2 = await Room.find(filter2);

  if (getRoom1.length == 0 && getRoom2.length == 0) {
    const msg = "User don't have any room chat";
    return handleFailed(res, msg);
  }

  let roomArr = [];

  if (getRoom1) {
    for (const key of getRoom1) {
      let nameObject = {};
      nameObject.name = key.userNameReceive;
      nameObject.userIdReceive = key.userIdReceive;
      nameObject.roomId = key.roomId;
      roomArr.push(nameObject);
    }
  }
  if (getRoom2) {
    for (const key of getRoom2) {
      let nameObject = {};
      nameObject.name = key.userNameSend;
      nameObject.userIdReceive = key.userIdSend;
      nameObject.roomId = key.roomId;
      roomArr.push(nameObject);
    }
  }

  var result = roomArr.filter(function (a) {
    var key = a.roomId;
    if (!this[key]) {
      this[key] = true;
      return true;
    }
  }, Object.create(null));

  return res.json(result);
};

//Check room by userIdSend and userIdReceive
exports.checkRoomAvailable = async (req, res) => {
  const { userIdSend, userIdReceive } = req.body;

  if (
    userIdSend.match(/^[0-9a-fA-F]{24}$/) &&
    userIdReceive.match(/^[0-9a-fA-F]{24}$/)
  ) {
    const filter1 = { userIdSend: userIdSend, userIdReceive: userIdReceive };
    const filter2 = { userIdSend: userIdReceive, userIdReceive: userIdSend };
    const room1 = await Room.findOne(filter1);
    const room2 = await Room.findOne(filter2);

    if (room1) {
      const roomId = room1.roomId;
      return res.json({
        status: false,
        roomId: roomId,
      });
    } else if (room2) {
      const roomId = room2.roomId;
      return res.json({
        status: false,
        roomId: roomId,
      });
    } else {
      return res.json({
        status: true,
        roomId: "",
      });
    }
  } else {
    return res.json({
      status: false,
      roomId: "",
    });
  }
};

// Create room
exports.createRoom = async (req, res) => {
  const { userIdSend, userIdReceive } = req.body;

  const filter1 = { userIdSend: userIdSend, userIdReceive: userIdReceive };
  const filter2 = { userIdSend: userIdReceive, userIdReceive: userIdSend };
  const room1 = await Room.findOne(filter1);
  const room2 = await Room.findOne(filter2);

  const msg = "Create room success";
  if (room1) {
    handleSuccess(res, room1, msg);
  } else if (room2) {
    handleSuccess(res, room2, msg);
  } else {
    let idRandom = uuidv4();
    const userSend = await User.findById(userIdSend);
    const userReceive = await User.findById(userIdReceive);

    if (userSend && userReceive) {
      Room.create(
        {
          userIdSend: userIdSend,
          userNameSend: userSend.user_name,
          userIdReceive: userIdReceive,
          userNameReceive: userReceive.user_name,
          roomId: idRandom,
        },
        function (err, success) {
          if (err) {
            handleFailed(res, err);
          } else {
            //handle success
            handleSuccess(res, success, msg);
          }
        }
      );
    }
  }
};

exports.messageDetail = async (req, res) => {
  const { roomId } = req.body;
  const filter = { roomId: roomId };
  await Message.find(filter, (err, message) => {
    if (!err) {
      res.json(message);
    } else {
      res.json(err);
    }
  });
};
