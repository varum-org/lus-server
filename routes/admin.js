const express = require("express");
const router = express.Router();

const adminControllerIdol = require("../controllers/admin/idol/idol");
const adminControllerDashboard = require("../controllers/admin/dashboard/dashboard");
const adminControllerUser = require("../controllers/admin/user/user");
const adminControllerService = require("../controllers/admin/service/service");

const multer = require("multer");
const upload = multer({ dest: "public/image/" });

const adminRoute = (passport) => {
  router.get("/", (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/admin/dashboard");
    res.redirect("/admin/signin");
  });
  router.get("/signin", adminControllerUser.get_signin);
  router.post(
    "/signin",
    passport.authenticate("signin", {
      successRedirect: "/admin/dashboard",
      failureRedirect: "/admin/signin",
      failureFlash: true,
    })
  );
  router.get("/logout", isAuthenticated, adminControllerUser.logout);

  router.get("/dashboard", isAuthenticated, adminControllerDashboard.dashboard);
  router.get("/idols", adminControllerIdol.list);
  router.get("/idol", adminControllerIdol.getCreate);
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
  router.get("/service/:id", adminControllerService.detail);
  router.post(
    "/service",
    upload.single("image_gallery"),
    adminControllerService.create
  );
  router.post(
    "/service/:id",
    upload.single("image_gallery"),
    adminControllerService.update
  );
  router.delete("/service", adminControllerService.delete);
  router.get("/service", adminControllerService.get_create);

  return router;
};

const isAuthenticated = (req, res, next) => {
  //Nếu đã đăng nhập thì tiếp tục điều hướng
  if (req.isAuthenticated()) return next();
  //Nếu chưa đăng nhập thì chuyển về trang đăng nhập
  res.redirect("/admin/signin");
};

module.exports = adminRoute;
