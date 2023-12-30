const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "WebAppWarfare@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = (email, username) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Welcome to WebAppWarfare!",
    text: `Hello ${username},\n\nThank you for signing up for WebAppWarfare. We're excited to have you on board!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendWelcomeEmail };
