const functions = require("firebase-functions/v2");
const nodemailer = require("nodemailer");

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const transporter = nodemailer.createTransporter({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: { user: smtpUser, pass: smtpPass }
});

exports.sendEmailOnContact = functions.firestore
  .document("contacts/{id}")
  .onCreate(async (snap) => {
    const data = snap.data();
    const mailOptions = {
      from: smtpUser,
      to: "manager@senharvest.com",
      subject: `[SenHarvest] Nouvelle demande: ${data.subject}`,
      text: `Nom: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`
    };
    await transporter.sendMail(mailOptions);
  });
