const express = require("express");
const router = express.Router();

const adminControllerIdol = require("../controllers/admin/idol/idol");
const adminControllerDashboard = require("../controllers/admin/dashboard/dashboard");
const adminControllerUser = require("../controllers/admin/user/user");
const adminControllerService = require("../controllers/admin/service/service");
const adminControllerBanner = require("../controllers/admin/banner/banner");
const adminControllerOrder = require("../controllers/admin/order/order");
const adminControllerOrderSuccess = require("../controllers/admin/order/order_success");
const adminControllerPhoto = require("../controllers/admin/photo/photo");

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
  router.get("/idols", isAuthenticated, adminControllerIdol.list);
  router.get("/idol", isAuthenticated, adminControllerIdol.getCreate);
  router.post(
    "/idol",
    upload.array("image_gallery", 10),
    isAuthenticated,
    adminControllerIdol.create
  );
  router.get("/idol/:id", isAuthenticated, adminControllerIdol.detail);
  router.post("/idol/:id", isAuthenticated, adminControllerIdol.update);
  router.delete("/idol", isAuthenticated, adminControllerIdol.delete);

  router.get("/users", isAuthenticated, adminControllerUser.list);
  router.get("/user/:id", isAuthenticated, adminControllerUser.detail);
  router.post("/user/:id", isAuthenticated, adminControllerUser.update);
  router.delete("/user", isAuthenticated, adminControllerUser.delete);

  router.get("/services", isAuthenticated, adminControllerService.list);
  router.get("/service/:id", isAuthenticated, adminControllerService.detail);
  router.post(
    "/service",
    upload.single("image_gallery"),
    isAuthenticated,
    adminControllerService.create
  );
  router.post(
    "/service/:id",
    upload.single("image_gallery"),
    isAuthenticated,
    adminControllerService.update
  );
  router.delete("/service", isAuthenticated, adminControllerService.delete);
  router.get("/service", isAuthenticated, adminControllerService.get_create);

  router.get("/banners", isAuthenticated, adminControllerBanner.list);

  router.get("/orders", isAuthenticated, adminControllerOrder.list);
  router.get("/order/:id", isAuthenticated, adminControllerOrder.detail);

  router.get(
    "/orders_success",
    isAuthenticated,
    adminControllerOrderSuccess.list
  );

  router.get("/photos", isAuthenticated, adminControllerPhoto.list);

  return router;
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/admin/signin");
};

module.exports = adminRoute;
