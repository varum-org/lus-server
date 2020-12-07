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
  YAML = require("yamljs"),
  handlebars = require("express-handlebars"),
  path = require("path"),
  cors = require("cors");

// Config handlebars
app.engine(
  ".hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views/partials"),
    layoutsDir: path.join(__dirname, "views/layouts"),
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

// Config app
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
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
    console.log(data);
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
  res.render("home/home.hbs", {
    layout: "main.hbs",
    // message: req.flash("message"),
  })
);

//Route
app.use("/api/v1", require("./routes/api.js"));
app.use("/admin", require("./routes/admin"));

// Swagger
const swaggerDocument = YAML.load("./docs/api-docs.yml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get("*", (req, res) => {
  res.render("errors/error404.hbs", {
    layout: "index.hbs",
  });
});

http.listen(PORT, function () {
  console.log(`Running on http://${HOST}:${PORT}`);
});
