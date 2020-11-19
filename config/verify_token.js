const jwt = require("jsonwebtoken");
const config = require("./config");
const { handleFailed } = require("../controllers/user/middleware");

const verify_token = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
  if (token != undefined && token != null) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        const mess = "Failed to authenticate token";
        handleFailed(res, mess, 401);
      } else {
        next();
      }
    });
  } else {
    const mess = "No token provided.";
    handleFailed(res, mess, 403);
  }
};

module.exports = verify_token;
