import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as functions from 'firebase-functions';

admin.initializeApp();
const auth = admin.auth();
const db = admin.firestore();

// ---- SMTP Hostinger ----
// Config dans Firebase Console > Functions > Variables d'env (ou .env.functions.local pour émulateur)
// EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_TO (manager@senharvest.com)

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,     // ex: smtp.hostinger.com
  port: Number(process.env.EMAIL_PORT || 465),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// === 1) Donner un rôle admin à un email ===
export const grantAdmin = onCall({ cors: true, region: 'us-central1' }, async (req) => {
  const requester = req.auth;
  if (!requester) throw new HttpsError('unauthenticated', 'Auth required.');
  // Ici on peut restreindre: seul un super-admin (préconfiguré) peut donner le rôle
  // Pour faire simple: autoriser si le demandeur a déjà admin==true
  if (!requester.token?.admin) throw new HttpsError('permission-denied', 'Only admin can grant admin.');
  const { email } = req.data || {};
  if (!email) throw new HttpsError('invalid-argument', 'email required');

  const user = await auth.getUserByEmail(email).catch(() => null);
  if (!user) throw new HttpsError('not-found', 'user not found');

  await auth.setCustomUserClaims(user.uid, { admin: true });
  return { ok: true };
});

// === 2) Envoi email Contact + sauvegarde (déjà enregistré côté client aussi, redondance ok) ===
export const sendContactEmail = onCall({ cors: true, region: 'us-central1' }, async (req) => {
  const data = req.data || {};
  const {
    name = '', email = '', phone = '',
    subject = '', quantity = '', destination = '',
    incoterm = '', payment = '', message = ''
  } = data;

  // Sauvegarde sécurité côté serveur (optionnel si déjà côté client)
  await db.collection('contacts').add({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const to = process.env.EMAIL_TO || 'manager@senharvest.com';
  const html = `
    <h2>Nouvelle demande de contact – SenHarvest.com</h2>
    <p><b>Nom:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Téléphone:</b> ${phone}</p>
    <p><b>Sujet:</b> ${subject}</p>
    <p><b>Quantité:</b> ${quantity}</p>
    <p><b>Destination:</b> ${destination}</p>
    <p><b>Incoterm:</b> ${incoterm}</p>
    <p><b>Paiement:</b> ${payment}</p>
    <p><b>Message:</b><br/>${(message||'').replace(/\n/g,'<br/>')}</p>
    <hr/>
    <p>Mail auto – Site SenHarvest</p>
  `;

  await transporter.sendMail({
    from: `"SenHarvest Site" <${process.env.EMAIL_USER}>`,
    to,
    subject: `[SenHarvest] ${subject || 'Contact'}`,
    html,
    replyTo: email || undefined,
  });

  return { ok: true };
});