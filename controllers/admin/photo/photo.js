const Idol = require("../../../models/idol");

exports.list = async (req, res) => {
  const images = [];
  const idols = await Idol.find();
  if (idols) {
    for (const key of idols) {
      for (const image of key.image_gallery) {
        images.push(image);
      }
    }
  }

  res.render("admin/photos/photo", {
    layout: "admin/layouts/main.hbs",
    title: "Hình ảnh",
    active: { Photo: true },
    images: images,
  });
};
