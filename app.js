// Use dotenv to read .env vars into Node
require("dotenv").config();
// Constants
const express = require("express"),
  bodyParser = require("body-parser"),
  PORT = process.env.PORT,
  HOST = process.env.HOST,
  app = express(),
  swaggerUi = require("swagger-ui-express"),
  mongose = require("mongoose"),
  Message = require("./models/message.js"),
  http = require("http").createServer(app),
  io = require("socket.io")(http),
  YAML = require("yamljs");

// configure body-parser
app.use(bodyParser.json({ limit: "50mb" })); // parse form data client
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//Configure Mongodb
const db = require("./config/database.js").mongoURI;
//Connect to Mongosse
mongose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGODB CONNECTED ... ");
  })
  .catch((err) => console.log(err));

const { async } = require("crypto-random-string");
//Config Socket io
const Room = require("./models/room");
const User = require("./models/user");

let userIdOnlines = [];
io.on("connection", (socket) => {
  socket.on("online", async (user_id) => {
    socket.join(user_id);
    socket.user_id = user_id;
    if (userIdOnlines[user_id] == undefined) {
      userIdOnlines.push(user_id);
    }
    console.log(userIdOnlines);
    await joins(socket, user_id);
    console.log(`${socket.email} connect: ${user_id}`);
  });

  socket.on("newRoom", (roomString) => {
    const room = JSON.parse(roomString);
    if (socket.rooms[room._id] == undefined) {
      socket.join(room._id);
      console.log(`${socket.email} connect new room: ${room._id}`);
      const user_ids = [...room.user_id];
      user_ids.shift(socket.user_id);
      if (userIdOnlines.includes(user_ids[0])) {
        socket.join(user_ids[0]);
        console.log(`${socket.email} connect: ${user_ids[0]}`);
        socket.broadcast.to(user_ids[0]).emit("joinRoom", JSON.stringify(room));
      }
    }
  });
  socket.on("joinRoom", async (roomString) => {
    const room = JSON.parse(roomString);
    socket.join(room._id);
    console.log(`${socket.email} connect new room: ${room._id}`);
    const user_ids = [...room.user_id];
    user_ids.shift(socket.user_id);
    if (userIdOnlines.includes(user_ids[0])) {
      const roomResponse = await handleResponseRoom(user_ids[0], room);
      console.log(`${socket.email} send roomResponse to: ${user_ids[0]}`);
      io.to(room._id).emit("updateRooms", JSON.stringify(roomResponse));
    }
  });

  socket.on("joinChat", (roomId) => {
    let size = 0;
    socket.join(roomId + roomId);
    Message.updateMany(
      { room_id: roomId, is_read: 0 },
      { $set: { is_read: 1 } },
      { multi: true },
      (err, writeResult) => {
        if (err) {
          console.log("Socket: isRead ", err);
        } else {
          console.log("Socket: isRead " + writeResult);
        }
      }
    );
    console.log(`${socket.email} join chat: ${roomId}`);
    const adapters = io.sockets.adapter.rooms[roomId + roomId];
    if (adapters !== undefined) size = adapters.length;
    const newRoom = {
      _id: roomId,
      size: size,
    };
    io.to(roomId).emit("joinChat", newRoom);
  });

  socket.on("leaveChat", (roomId) => {
    let size = 0;
    socket.leave(roomId + roomId);
    console.log(`${socket.email} leave chat: ${roomId}`);
    const adapters = io.sockets.adapter.rooms[roomId + roomId];
    if (adapters !== undefined) size = adapters.length;
    const newRoom = {
      _id: roomId,
      size: size,
    };
    io.to(roomId).emit("leaveChat", newRoom);
  });

  socket.on("clientSendMessage", (data) => {
    console.log(data);
    const message = JSON.parse(data);
    const roomId = message.room_id;
    Message.create(
      {
        room_id: message.room_id,
        user_id: message.user_id,
        content: message.content,
        is_read: message.is_read,
      },
      (err, docs) => {
        if (err) {
          res.json(err);
        } else {
          console.log(`${socket.email} send message to: ${docs}`);
          socket.broadcast
            .to(roomId)
            .emit("serverSendMessage", JSON.stringify(docs));
        }
      }
    );
  });

  socket.on("typing", (room_id) => {
    //Only roomNumber is needed here
    console.log("typing triggered");
    socket.broadcast.to(`${room_id}`).emit("typing");
  });

  socket.on("stopTyping", (room_id) => {
    //Only roomNumber is needed here
    console.log("stopTyping triggered");
    socket.broadcast.to(`${room_id}`).emit("stopTyping");
  });

  socket.on("disconnect", () => {
    userIdOnlines.shift(socket.user_id);
  });
});
const handleResponseRoom = async (user_id, room) => {
  let newRoom = { room: room };
  const userReceive = await User.findOne(
    { _id: user_id },
    {
      password: 0,
      device_token: 0,
      token: 0,
      email_code: 0,
      email_code_expires: 0,
    }
  );
  newRoom.userReceive = userReceive;
  return newRoom;
};

const joins = async (socket, user_id) => {
  const user = await User.findOne({ _id: user_id });
  socket.email = user.email;
  const filter = { user_id: user._id };
  Room.find(filter, (err, docs) => {
    if (err) {
      console.log(`error:` + err);
    } else {
      docs.forEach((element) => {
        socket.join(element._id);
        console.log(`${user.email} connect to room: ${element._id}`);
      });
    }
  });
};

// configure body-parser
app.use(bodyParser.json({ limit: "50mb" })); // parse form data client
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// app entry point
app.get("/", (req, res) =>
  res.status(200).send({
    message: "Welcome to our glorious app",
  })
);

//Route
app.use("/api/v1", require("./routes/api.js"));

// Swagger
const swaggerDocument = YAML.load("./docs/api-docs.yml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness.",
  })
);

http.listen(PORT, async function () {
  console.log(`Running on http://${HOST}:${PORT}`);
  // await Room.remove({});
  // await Message.remove({});
});
