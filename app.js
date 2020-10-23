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
  YAML = require('yamljs');

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

io.on("connection", (socket) => {
  socket.emit("askForUserId");
  socket.on("create room", (msg) => {
    socket.broadcast.emit("broadcast", "Hello");
  });

  var roomMap = {};
  socket.on("join", (room) => {
    roomMap["roomId"] = room;
    socket.join(room);
    // console.log(`A user connect to room: ${room}`)
  });

  socket.on("chat message", (message) => {
    const roomId = message.roomId;
    const messageData = message.content;
    const userIdSend = message.userIdSend;
    const userIdReceive = message.userIdReceive;
    io.in(roomMap.roomId).emit("mymessage", userIdSend, messageData);

    Message.create(
      {
        roomId: roomId,
        userIdSend: userIdSend,
        userIdReceive: userIdReceive,
        content: messageData,
      },
      function (err, success) {
        if (err) {
          res.json(err);
        } else {
          // console.log(success)
        }
      }
    );
  });
});

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
const swaggerDocument = YAML.load('./docs/api-docs.yml');
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness.",
  })
);

http.listen(PORT, function () {
  console.log(`Running on http://${HOST}:${PORT}`);
});
