require("dotenv").config();
const express = require("express"),
  bodyParser = require("body-parser"),
  PORT = process.env.PORT,
  HOST = process.env.HOST,
  app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const mongose = require("mongoose");
const Message = require("./models/message.js");
var http = require("http").createServer(app);
var io = require("socket.io")(http);

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

// app entry point
app.get("/", (req, res) =>
  res.status(200).send({
    message: "Welcome to our glorious app",
  })
);

//Route
app.use("/api/v1", require("./routes/api.js"));

// Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Lus API",
      description: "Lus API Information",
      contact: {
        name: "VTNPlusD Team",
      },
      services: ["http://localhost:3000"],
    },
  },
  apis: ["app.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness.",
  })
);

http.listen(PORT, function () {
  console.log(`Running on http://${HOST}:${PORT}`);
});

/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *    description: Use to login
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to login
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response!
 */

/**
 * @swagger
 * /api/v1/user/register:
 *  post:
 *    description: Use to Register
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to create
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *            - user_name
 *            - phone
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *            user_name:
 *              type: string
 *            phone:
 *              type: number
 *    responses:
 *      '200':
 *        description: A successful response!
 */
