const nodemailer = require("nodemailer");

module.exports.sendMail = async ({ from, to, subject, text }) => {
  try {
    let mailOptions = {
      from,
      to,
      subject,
      text,
    };
    const Transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.email,
        pass: process.env.emailpassword,
      },
    });
    return await Transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
