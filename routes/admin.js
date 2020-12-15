const express = require("express");

const adminControllerIdol = require("../controllers/admin/idol/idol");
const adminControllerDashboard = require("../controllers/admin/dashboard/dashboard");
const adminControllerUser = require("../controllers/admin/user/user");
const adminControllerService = require("../controllers/admin/service/service")

const multer = require("multer");
const upload = multer({ dest: "public/image/" });
const router = express.Router();

router.get("/dashboard", adminControllerDashboard.dashboard);
router.get("/idols", adminControllerIdol.list);
router.get("/idol", async (req, res) => {
  return res.render("admin/idols/idol_create.hbs", {
    layout: "admin/layouts/main.hbs",
    title: "Đăng ký Idol",
  });
});
router.post(
  "/idol",
  upload.array("image_gallery", 10),
  adminControllerIdol.create
);
router.get("/idol/:id", adminControllerIdol.detail);
router.post("/idol/:id", adminControllerIdol.update);
router.delete("/idol", adminControllerIdol.delete);

router.get("/users", adminControllerUser.list);
router.get("/user/:id", adminControllerUser.detail);
router.post("/user/:id", adminControllerUser.update);
router.delete("/user", adminControllerUser.delete);

router.get("/services", adminControllerService.list);

module.exports = router;
