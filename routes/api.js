const express = require("express");
const router = express.Router();
const controllerApiUser = require("../controllers/user/user");
const controllerApiMessage = require("../controllers/message/message");
const controllerIdol = require("../controllers/idol/idol");
const controllerCart = require("../controllers/favorite/favorite");
const controllerOrder = require("../controllers/order/order");
const controllerService = require("../controllers/service/service");
const controllerLike = require("../controllers/like/like");
const {
  requireEmailLogin,
  requirePasswordLogin,
  requireEmailRegister,
  requireVerifyEmail,
  requirePasswordRegister,
  requireUserNameRegister,
  requirePhoneRegister,
  requireEmailCode,
  requireId,
} = require("../controllers/user/validators");
const {
  requireUserId,
  requireNickName,
  requireImageGallery,
  requireServices,
  search,
  images,
} = require("../controllers/idol/validatiors");
const { requireIdolIdCart } = require("../controllers/favorite/validators");
const {
  requireUserIdReceiveMess,
} = require("../controllers/message/validators");
const { handleErrors } = require("../controllers/user/middleware");
const verify_token = require("../config/verify_token");
const {
  requireOrder,
  requireStartDate,
  requireOrderUpdate,
} = require("../controllers/order/validators");
const multer = require("multer");
const upload = multer({ dest: "public/image/" });

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
  [requireVerifyEmail, requireEmailCode],
  handleErrors(),
  controllerApiUser.verifyEmail
);
router.post(
  "/user/reset_email_code",
  [requireEmailRegister],
  handleErrors(),
  controllerApiUser.resetEmailCode
);
router.get(
  "/user/:id",
  [requireId],
  handleErrors(),
  controllerApiUser.userInfomation
);

// Message -------------------------
router.get("/message/rooms", verify_token, controllerApiMessage.loadAllRoom);
router.post(
  "/message/rooms/check",
  verify_token,
  [requireId],
  handleErrors(),
  controllerApiMessage.checkRoomAvailable
);
router.post(
  "/message/rooms",
  verify_token,
  [requireUserIdReceiveMess],
  handleErrors(),
  controllerApiMessage.createRoom
);
router.get("/message/:id", verify_token, controllerApiMessage.messageDetail);

// Idol -------------------------
router.get("/idols", controllerIdol.list);
router.get("/idols/search", [search], handleErrors(), controllerIdol.search);
router.post(
  "/idols",
  verify_token,
  [requireNickName, requireImageGallery, requireServices],
  handleErrors(),
  controllerIdol.register
);
router.put(
  "/idols",
  verify_token,
  [requireUserId, requireNickName, requireImageGallery, requireServices],
  handleErrors(),
  controllerIdol.update
);
router.post(
  "/uploads",
  verify_token,
  upload.array("image_gallery", 10),
  [images],
  handleErrors(),
  controllerIdol.upload_image
);

// Favorite -------------------------
router.get("/favorites", verify_token, controllerCart.list);
router.post(
  "/favorites/:id",
  [requireIdolIdCart],
  handleErrors(),
  verify_token,
  controllerCart.add
);
router.delete(
  "/favorites/:id",
  [requireIdolIdCart],
  handleErrors(),
  verify_token,
  controllerCart.delete
);

// Order -------------------------
router.get("/orders", verify_token, controllerOrder.list);
router.get("idol/orders", verify_token, controllerOrder.list_for_idol);
router.post(
  "/orders",
  [requireOrder, requireStartDate],
  handleErrors(),
  verify_token,
  controllerOrder.add
);
router.delete("/orders", verify_token, controllerOrder.delete);
router.patch(
  "/orders",
  [requireOrderUpdate],
  handleErrors(),
  verify_token,
  controllerOrder.update
);

// Service -------------------------
router.get("/services", verify_token, controllerService.list);
router.post("/services", controllerService.add);

// Like -------------------------
router.get("/like", verify_token, controllerLike.like);
