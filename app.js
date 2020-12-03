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
io.on("connection", (socket) => {
  socket.on("join", async (id) => {
    const user = await User.findOne({ _id: id });
    const filter = { user_id: user._id };
    Room.find(filter, (err, docs) => {
      if (err) {
        console.log(`error:` + err);
      } else {
        docs.forEach((element) => {
          socket.join(element._id);
          io.to(element._id).emit("online", user._id);
          console.log(`A user connect to room: ${element._id}`);
        });
      }
    });
  });

  socket.on("clientSendMessage", (data) => {
    const message = JSON.parse(data);
    const roomId = message.room_id;
    Message.create(
      {
        room_id: message.room_id,
        user_id: message.user_id,
        content: message.content,
      },
      (err, docs) => {
        if (err) {
          res.json(err);
        } else {
          io.to(roomId).emit("serverSendMessage", JSON.stringify(docs));
        }
      }
    );
  });
  socket.on("offline", async (id) => {
    const user = await User.findOne({ _id: id });
    const filter = { user_id: user._id };
    Room.find(filter, (err, docs) => {
      if (err) {
        console.log(`error:` + err);
      } else {
        docs.forEach((element) => {
          socket.leave(element._id);
          socket.broadcast.to(element._id).emit("offline", user._id);
          console.log(`A user disconnect to room: ${element._id}`);
        });
      }
    });
  });
  socket.on("disconnect", () => {
    console.log("One of sockets disconnected from our server.");
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
const swaggerDocument = YAML.load("./docs/api-docs.yml");
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
