const express = require("express");
const router = express.Router();
const controllerApiUser = require("../controllers/user/user");
const controllerApiMessage = require("../controllers/message/message");
const controllerIdol = require("../controllers/idol/idol");
const controllerCart = require("../controllers/cart/cart");
const controllerOrder = require("../controllers/order/order");
const controllerService = require("../controllers/service/service");
const {
  requireEmailLogin,
  requirePasswordLogin,
  requireEmailRegister,
  requireVerifyEmail,
  requirePasswordRegister,
  requireId,
  requireUserNameRegister,
  requirePhoneRegister,
  requireEmailCode,
} = require("../controllers/user/validators");
const {
  requireUserId,
  requireNickName,
  requireImageGallery,
  requireServices,
} = require("../controllers/idol/validatiors");
const {
  requireIdolIdCart,
  requireUserIdCart,
} = require("../controllers/cart/validators");
const {
  requireUserIdSendMess,
  requireUserIdReceiveMess,
} = require("../controllers/message/validators");
const { handleErrors } = require("../controllers/user/middleware");
const verify_token = require("../config/verify_token");
const {
  requireOrder,
  requireStartDate,
} = require("../controllers/order/validators");

module.exports = router;

router.post(
  "/user/login",
  [requireEmailLogin, requirePasswordLogin],
  handleErrors(),
  controllerApiUser.login
);
router.post(
  "/user/register",
  [
    requireEmailRegister,
    requirePasswordRegister,
    requireUserNameRegister,
    requirePhoneRegister,
  ],
  handleErrors(),
  controllerApiUser.register
);
router.post(
  "/user/verify_email",
  [requireEmailRegister, requireVerifyEmail, requireEmailCode],
  handleErrors(),
  controllerApiUser.verifyEmail
);
router.post(
  "/user/reset_email_code",
  [requireEmailRegister],
  handleErrors(),
  controllerApiUser.resetEmailCode
);
router.post(
  "/user/information",
  verify_token,
  [requireId],
  handleErrors(),
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
  [requireUserIdSendMess, requireUserIdReceiveMess],
  handleErrors(),
  controllerApiMessage.createRoom
);
router.post(
  "/message/detail",
  verify_token,
  controllerApiMessage.messageDetail
);

// Idol
router.post(
  "/idol/register",
  verify_token,
  [requireUserId, requireNickName, requireImageGallery, requireServices],
  handleErrors(),
  controllerIdol.register
);
router.post(
  "/idol/update",
  verify_token,
  [requireUserId, requireNickName, requireImageGallery, requireServices],
  handleErrors(),
  controllerIdol.update
);

// Cart
router.post(
  "/cart/list",
  [requireUserIdCart],
  handleErrors(),
  verify_token,
  controllerCart.list
);
router.post(
  "/cart/add",
  [requireUserIdCart, requireIdolIdCart],
  handleErrors(),
  verify_token,
  controllerCart.add
);
router.post(
  "/cart/delete",
  [requireUserIdCart, requireIdolIdCart],
  handleErrors(),
  verify_token,
  controllerCart.delete
);

// Order
router.post(
  "/order/add",
  [requireOrder, requireStartDate],
  handleErrors(),
  controllerOrder.add
);
router.delete("/order/delete", controllerOrder.delete);
router.patch("/order/update", controllerOrder.update);

// Service
router.get("/service/list", controllerService.list);
router.post("/service/add", controllerService.add);
