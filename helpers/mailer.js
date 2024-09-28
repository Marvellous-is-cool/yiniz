const nodemailer = require("nodemailer");

// Create transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS, // Your Gmail password or App Password
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("Error with Nodemailer:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});
