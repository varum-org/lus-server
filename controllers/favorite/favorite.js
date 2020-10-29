const Favorite = require("../../models/favorite");
const Idol = require("../../models/idol");
const { handleList, handleSuccess, handleFailed } = require("./middleware");
const User = require("../../models/user");

exports.list = async (req, res) => {
  const token = req.header("authorization");
  const user = User.findOne({ token: token });
  const favorite = await Favorite.find({ user_id: user._id });
  if (favorite) {
    const msg = "List favorite successfully!";
    return handleList(res, favorite, msg);
  }
  const msg = "List favorite failure!";
  return handleFailed(res, msg);
};

exports.add = async (req, res) => {
  const { id } = req.params;
  const token = req.header("authorization");

  const user = await User.findOne({ token: token });
  const idol = await Idol.findOne({ user_id: id });
  if (idol && idol.status === 0) {
    const user_favorite = await Favorite.findOne({
      user_id: user._id,
      idol_id: id,
    });
    if (user_favorite) {
      const msg = "You liked this Idol!";
      return handleFailed(res, msg);
    }

    const favorite = new Favorite({
      user_id: user._id,
      idol_id: id,
    });

    favorite.save((err, docs) => {
      if (err) {
        const msg = "Add Idol to favorite failure!";
        return handleFailed(res, msg);
      }
      const msg = "Add Idol to favorite successfully!";
      return handleSuccess(res, docs, msg);
    });
  } else {
    const msg = "Idol are not available";
    return handleFailed(res, msg);
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const token = req.header("authorization");

  const user = await User.findOne({ token: token });
  await Favorite.findOneAndDelete({ user_id: user._id, idol_id: id }, (err) => {
    if (!err) {
      const msg = "Delete Idol from favorite successfully!";
      return handleFailed(res, msg);
    }
    const msg = "Delete Idol from favorite failure!";
    return handleFailed(res, msg);
  });
};
