const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const { handleMail, handleFailed } = require("../controllers/user/middleware");
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
const accessToken = oauth2Client.getAccessToken();
exports.sendEmail = async (email, res, code) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      accessType: "offline",
      user: process.env.EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailDetails = {
    from: process.env.EMAIL,
    to: email,
    subject: "Lovely: verify email address",
    html: `<h3>Please confirm your email address </h3> </hr> <h5>Your code: </h5> <h1>${code}</h1>`,
    generateTextFromHTML: true,
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
