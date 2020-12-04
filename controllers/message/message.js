const Room = require("../../models/room");
const User = require("../../models/user");
const { v4: uuidv4 } = require("uuid");
const { handleSuccess, handleFailed } = require("./middleware");
const Message = require("../../models/message");
const { async } = require("crypto-random-string");

exports.loadAllRoom = async (req, res) => {
  const token = req.header("authorization");
  const user = await User.findOne({ token: token });
  if (user) {
    const filter = { user_id: user._id };
    const rooms = await Room.find(filter);
    const newRooms = await handleResponseRoom(rooms);
    return handleSuccess(res, newRooms, "Get room success!");
  } else {
    return handleFailed(res, "Not found user!", 401);
  }
};

// Create room
exports.createRoom = async (req, res) => {
  const { id } = req.body;
  const token = req.header("authorization");
  const userSend = await User.findOne({ token: token });
  const userReceive = await User.findById(id);
  if (userSend && userReceive) {
    console.log("User:" + userSend);
    const filter = { user_id: [userSend._id, userReceive._id] };
    const room = await Room.findOne(filter);
    if (room) {
      const msg = "Get room success";
      handleSuccess(res, room, msg);
    } else {
      const newRoom = new Room({
        user_id: [userSend._id, userReceive._id],
      });
      newRoom.save((err, docs) => {
        if (!err) {
          const msg = "Create  room success";
          handleSuccess(res, docs, msg);
        } else {
          handleFailed(res, err, 500);
        }
      });
    }
  } else {
    handleFailed(res, "Not found user!", 401);
  }
};

exports.messageDetail = async (req, res) => {
  const { id } = req.params;
  const filter = { room_id: id };
  await Message.find(filter, (err, messages) => {
    if (!err) {
      const msg = "Get messages success";
      handleSuccess(res, messages, msg);
    } else {
      handleFailed(res, err, 500);
    }
  });
};

const handleResponseRoom = async (rooms) => {
  let arr = [];
  for (const itemData of rooms) {
    let newRoom = { room: itemData };
    const users = await User.find({ _id: { $in: itemData.user_id } });

    newRoom.users = users;
    arr.push(newRoom);
  }
  return arr;
};
// exports.checkRoomAvailable = async (req, res) => {
//   const { id } = req.body;
//   const token = req.header("authorization");
//   const userSend = await User.findOne({ token: token });
//   const userReceive = await User.findById(id);
//   if (!userSend && !userReceive) {
//     handleFailed(res, "Not found user!", 401);
//   }
//   const filter = { user_id: [userSend._id, userSend._id] };
//   const room = await Room.findOne(filter);
//   if (room) {
//   } else {
//   }
// };
