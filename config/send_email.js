const nodemailer = require("nodemailer");
const { handleMail, handleFailed } = require("../controllers/user/middleware");

exports.sendEmail = async (email, res, code) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
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
      return handleFailed(res, err, 500);
    } else {
      const mess = `Verification code has been sent to email ${email} successfully`;
      handleMail(res, mess);
    }
  });
};
