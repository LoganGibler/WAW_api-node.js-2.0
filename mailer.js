const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

const sendWelcomeEmail = (email, username) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Welcome to Your App!',
    text: `Hello ${username},\n\nThank you for signing up on Your App. We're excited to have you on board!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendWelcomeEmail };