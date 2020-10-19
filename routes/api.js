const express = require("express");
const router = express.Router();
const controllerApiUser = require("../controllers/user/user");
const controllerApiMessage = require("../controllers/message/message");
const {
  requireEmailLogin,
  requirePasswordLogin,
  requireEmailRegister,
  requireVerifyCode,
  requirePasswordRegister,
  requireEmail,
} = require("../controllers/user/validators");
const { handleErrors } = require("../controllers/user/middleware");
const verify_token = require("../config/verify_token");

module.exports = router;

router.post(
  "/user/login",
  [requireEmailLogin, requirePasswordLogin],
  handleErrors(),
  controllerApiUser.checkLogin
);
router.post(
  "/user/register",
  [requireEmailRegister, requirePasswordRegister, requireVerifyCode],
  handleErrors(),
  controllerApiUser.checkRegister
);
router.post(
  "/user/verify_email",
  [requireEmailRegister],
  handleErrors(),
  controllerApiUser.verifyEmail
);
router.post(
  "/user/information",
  handleErrors(),
  verify_token,
  controllerApiUser.userInfomation
);

// Message
router.post(
  "/message/loadAllRoom",
  verify_token,
  controllerApiMessage.loadAllRoom
);
router.post(
  "/message/checkRoomAvailable",
  verify_token,
  controllerApiMessage.checkRoomAvailable
);
router.post(
  "/message/createRoom",
  verify_token,
  controllerApiMessage.createRoom
);
router.post(
  "/message/detail",
  verify_token,
  controllerApiMessage.messageDetail
);
