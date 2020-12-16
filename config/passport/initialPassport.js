const signin = require("./sign_in");
const User = require("../../models/user");

const initPassport = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  signin(passport);
};

module.exports = initPassport;
