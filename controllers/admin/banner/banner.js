exports.list = async (req, res) => {
  res.render("admin/banners/banner.hbs", {
    layout: "admin/layouts/main.hbs",
    title: "Banner",
    active: { Banner: true },
    //   yourname: req.user.fullname,
    //   avatar: req.user.avatar,
  });
};
