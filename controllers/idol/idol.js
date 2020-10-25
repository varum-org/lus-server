const Idol = require("../../models/idol");
const User = require("../../models/user");
const { handleFailed, handleSuccess } = require("./middleware");

exports.register = async (req, res) => {
  const {
    user_id,
    nick_name,
    address,
    relationship,
    description,
    image_gallery,
    services,
  } = req.body;

  const user = await User.findOne({ _id: user_id });
  if (user && user.role_id != 2) {
    const idol = new Idol({
      user_id: user_id,
      nick_name: nick_name,
      address: address,
      relationship: relationship,
      description: description,
      image_gallery: image_gallery,
      services: services,
    });

    idol.save((err, docs) => {
      if (err) {
        return handleFailed(res, err);
      }
      user.role_id = 2;
      user.save();

      const msg = "Register Idol successfully!";
      return handleSuccess(res, docs, msg);
    });
  } else {
    const msg = "User not found or User has been an Idol!";
    return handleFailed(res, msg);
  }
};

exports.update = async (req, res) => {
  const {
    user_id,
    nick_name,
    address,
    relationship,
    description,
    image_gallery,
    services,
  } = req.body;
  const idol = await Idol.findOne({ user_id: user_id });
  if (idol) {
    idol.nick_name = nick_name;
    idol.address = address;
    idol.relationship = relationship;
    idol.description = description;
    idol.image_gallery = image_gallery;
    idol.services = services;

    idol.save((err, docs) => {
      if (err) {
        return handleFailed(res, err);
      }
      const msg = "Update Idol successfully!";
      return handleSuccess(res, docs, msg);
    });
  } else {
    const msg = "User not found or User not an Idol!";
    return handleFailed(res, msg);
  }
};
