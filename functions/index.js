const admin = require("firebase-admin");
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

if (!admin.apps || !admin.apps.length) admin.initializeApp();

const RUNTIME = { region: "us-central1", timeoutSeconds: 30, memory: "256MB" };

// ---- CONFIG ----
// Ajoute ces variables : EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_TO
// via: firebase functions:config:set smtp.host="smtp.hostinger.com" smtp.port="465" smtp.user="inquiry@senharvest.com" smtp.pass="***" smtp.to="manager@senharvest.com"

const cfg = functions.config();
const HOST = cfg.smtp?.host || "smtp.hostinger.com";
const PORT = Number(cfg.smtp?.port || 465);
const USER = cfg.smtp?.user;
const PASS = cfg.smtp?.pass;
const TO = cfg.smtp?.to || "manager@senharvest.com";

const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  secure: PORT === 465,
  auth: { user: USER, pass: PASS }
});

// --- HTTPS endpoint: /sendContact ---
exports.sendContact = functions
  .runWith(RUNTIME)
  .https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).send("");

    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
      const { name, email, phone, subject, quantity, destination, incoterm, payment, message } = req.body || {};

      // Filter out undefined values for Firestore
      const firestoreData = {
        name: name || "",
        email: email || "",
        phone: phone || "",
        subject: subject || "",
        quantity: quantity || "",
        destination: destination || "",
        incoterm: incoterm || "",
        payment: payment || "",
        message: message || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "received"
      };

      // Save Firestore
      await admin.firestore().collection("contact_msgs").add(firestoreData);

      // Send mail
      const html = `
        <h3>Nouvelle demande de contact - SenHarvest Group</h3>
        <p><b>Nom:</b> ${name || ""}</p>
        <p><b>Email:</b> ${email || ""}</p>
        <p><b>Téléphone:</b> ${phone || ""}</p>
        <p><b>Objet:</b> ${subject || ""}</p>
        <p><b>Quantité:</b> ${quantity || ""}</p>
        <p><b>Destination:</b> ${destination || ""}</p>
        <p><b>Incoterm:</b> ${incoterm || ""}</p>
        <p><b>Paiement:</b> ${payment || ""}</p>
        <p><b>Message:</b><br/>${(message || "").replace(/\n/g,'<br/>')}</p>
        <hr/>
        <small>Envoyé depuis senharvest.com</small>
      `;

      await transporter.sendMail({
        from: `"SenHarvest Website" <${USER}>`,
        to: TO,
        subject: `[SenHarvest] ${subject || "Contact"}`,
        replyTo: email || undefined,
        html
      });

      return res.json({ ok: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ ok: false, error: e.message });
    }
  });


