const Idol = require("../../models/idol");
const User = require("../../models/user");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");
const { handleFailed, handleSuccess, handleList } = require("./middleware");
const Like = require("../../models/like");

exports.list = async (req, res) => {
  const { category } = req.query;
  const token = req.header("authorization");
  const user = await User.findOne({ token: token });
  
  if (user) {
    if (!category || category == "all") {
      const idols = await Idol.find();
      if (idols) {
        const responseIdols = await handleResponse(idols);
        const msg = "Get list idol success";
        return handleList(res, responseIdols, msg);
      } else {
        const msg = "Idols not found";
        return handleFailed(res, msg, 500);
      }
    } else if (category == "rating") {
      Idol.find()
        .sort({ rating: -1 })
        .limit(10)
        .then((idols) => handleResponse(idols))
        .then((responseIdols) => {
          return handleList(res, responseIdols, msg);
        })
        .catch((err) => {
          return handleFailed(res, err, 500);
        });
    } else if (category == "random") {
      const idols = await Idol.find();
      if (idols) {
        let newIdolList = [];
        var arr = [];
        while (arr.length < idols.length) {
          var r = Math.floor(Math.random() * idols.length);
          if (arr.indexOf(r) === -1) arr.push(r);
        }
        for (const key of arr) {
          newIdolList.push(idols[key]);
        }
        const responseIdols = await handleResponse(newIdolList);
        const msg = "Get list idol success";
        return handleList(res, responseIdols, msg);
      } else {
        const msg = "Get list random idol failure";
        return handleFailed(res, msg, 500);
      }
    }
  } else {
    const msg = "No user provided.";
    return handleFailed(res, msg, 404);
  }
};

exports.register = async (req, res) => {
  const {
    nick_name,
    address,
    relationship,
    description,
    image_gallery,
    services,
  } = req.body;
  const token = req.header("authorization");
  const user = await User.findOne({ token: token });

  if (user && user.role_id != 2) {
    const idol = new Idol({
      user_id: user._id,
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
    nick_name,
    address,
    relationship,
    description,
    image_gallery,
    services,
  } = req.body;
  const token = req.header("authorization");

  const user = await User.findOne({ token: token });
  const idol = await Idol.findOne({ user_id: user._id });
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

exports.search = async (req, res) => {
  const { name, rating } = req.query;

  Idol.find({ nick_name: new RegExp(name, "i") }, function (err, docs) {
    let newIdols = [];
    if (rating) {
      for (const key of docs) {
        if (key.rating >= rating) {
          newIdols.push(key);
        }
      }
      const msg = "Search Idol successfully!";
      return handleList(res, newIdols, msg);
    } else {
      const msg = "Search Idol successfully!";
      return handleList(res, docs, msg);
    }
  });
};
exports.upload_image = async (req, res) => {
  const uploader = async (path) => await cloudinary.uploader.upload(path);
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath.url);
    fs.unlinkSync(path);
  }

  const msg = "images uploaded successfully";
  return handleList(res, urls, msg);
};

async function handleResponse(idols) {
  const idolsArray = [];
  for (const data of idols) {
    let idol = { idol:data };
    const like = await Like.findOne({
      user_id: data._id,
      idol_id: idol.user_id,
    });
    if (like) {
      idol.liked = like.status;
    } else {
      idol.liked = false;
    }
    idolsArray.push(idol);
  }
  return idolsArray;
}
