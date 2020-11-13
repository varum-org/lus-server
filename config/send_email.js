const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const { handleMail, handleFailed } = require("../controllers/user/middleware");
const REDIRECT_URL =  "https://developers.google.com/oauthplayground"

exports.sendEmail = async (email, res, code) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: process.env.ACCESS_TOKEN,
    },
  });

  let mailDetails = {
    from: process.env.EMAIL,
    to: email,
    subject: "Lovely: verify email address",
    html: `<h3>Please confirm your email address </h3> </hr> <h5>Your code: </h5> <h1>${code}</h1>`,
  };

  mailTransporter.sendMail(mailDetails, (err, _) => {
    if (err) {
      console.log(err);

      return handleFailed(res, err, 500);
    } else {
      const mess = `Verification code has been sent to email ${email} successfully`;
      handleMail(res, mess);
    }
  });
};
