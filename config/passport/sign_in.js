const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const signIn = (passport) => {
  console.log("SIGN IN");
  passport.use(
    "signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        User.findOne({ email: email }, (err, user) => {
          if (err) return done(err);
          if (!user) {
            return done(
              null,
              false,
              req.flash("message", "Không có tài khoản này!!!")
            );
          }
          const match = isValidPassword(user, password);
          if (!match) {
            return done(
              null,
              false,
              req.flash(
                "message",
                "Tài khoản hoặc mật khẩu đăng nhập không chính xác."
              )
            );
          }
          return done(null, user);
        });
      }
    )
  );
  const isValidPassword = async (user, password) => {
    const match = await bcrypt.compare(password, user.password);
    return match;
  };
};

module.exports = signIn;
