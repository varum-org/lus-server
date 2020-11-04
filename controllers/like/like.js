const User = require("../../models/user");
const Like = require("../../models/like");
const Idol = require("../../models/idol");

exports.like = async (req, res) => {
  const token = req.header("authorization");
  const user = await User.findOne({ token: token });

  const { id } = req.query;
  const query = { user_id: user._id, idol_id: id };

  const idol = await Idol.findOne({ user_id: id });
  if (idol) {
    const like = await Like.findOne(query);
    if (like) {
      like.status = !like.status;
      like.save((err, result) => {
        if (!err) {
          return res.json(result);
        }
      });
    } else {
      const newLike = new Like({
        user_id: user._id,
        idol_id: id,
        status: true,
      });
      newLike.save((err, result) => {
        if (!err) {
          return res.json(result);
        }
      });
    }
  } else {
    return res.json("idol id not found");
  }
};
