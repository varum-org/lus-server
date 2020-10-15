// Use dotenv to read .env vars into Node
require("dotenv").config();
// Constants
const express = require("express"),
  bodyParser = require("body-parser"),
  PORT = process.env.PORT,
  HOST = process.env.HOST,
  app = express();
// configure body-parser
app.use(bodyParser.json({ limit: "50mb" })); // parse form data client
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app entry point
app.get("/", (req, res) =>
  res.status(200).send({
    message: "Welcome to our glorious app",
  })
);
// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness.",
  })
);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
