const admin = require('firebase-admin');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const nodemailer = require('nodemailer');

if (!admin.apps || !admin.apps.length) {
  admin.initializeApp();
}

// Liste blanche des emails admin (modifiable)
const ADMIN_WHITELIST = [
  'manager@senharvest.com',
  'abdoulahat.lo@senharvest.com',
  'senharvestlo@gmail.com'
];

/**
 * Callable: setAdminClaim
 * - Appelé par un super-admin (ou restreindre à la whitelist ci-dessous)
 */
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Restreindre l'appelant (ici: doit être déjà admin OU faire un contrôle fort)
  const callerEmail = context.auth?.token?.email || '';
  if (!callerEmail || !ADMIN_WHITELIST.includes(callerEmail)) {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }

  const { email, makeAdmin } = data || {};
  if (!email) throw new functions.https.HttpsError('invalid-argument', 'email required');

  // Trouver l'utilisateur par email
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: !!makeAdmin });

  return { ok: true, email, admin: !!makeAdmin };
});

/**
 * HTTPS: submitContact
 * - Enregistre contact dans Firestore + envoie email (Hostinger SMTP)
 * - Côté Netlify, appelez cet endpoint via fetch depuis le formulaire
 */
exports.submitContact = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
    try {
      const { name, email, phone, subject, quantity, destination, incoterm, payment, message, lang } = req.body || {};

      // Sauvegarde Firestore
      const db = admin.firestore();
      await db.collection('contacts').add({
        name, email, phone, subject, quantity, destination, incoterm, payment, message,
        lang: lang || 'fr',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Envoi email (Hostinger SMTP)
      const transporter = nodemailer.createTransporter({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER, // inquiry@senharvest.com par ex.
          pass: process.env.EMAIL_PASS
        }
      });

      const to = 'manager@senharvest.com';
      await transporter.sendMail({
        from: `"SenHarvest Website" <${process.env.EMAIL_USER}>`,
        to,
        subject: `[SenHarvest] ${subject || 'Contact form'}`,
        text: `
Nouvelle demande de contact

Nom: ${name}
Email: ${email}
Téléphone: ${phone}
Sujet: ${subject}
Quantité: ${quantity}
Destination: ${destination}
Incoterm: ${incoterm}
Paiement: ${payment}

Message:
${message}

-- Envoyé via site web
        `
      });

      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('submitContact error', e);
      return res.status(500).json({ ok: false, error: e.message });
    }
  });
});