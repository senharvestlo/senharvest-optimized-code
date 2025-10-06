// Sauvegarde des contacts + envoi email via CF si dispo
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDb } from '../config/firebase';
import { callSendContactEmail } from '../config/firebase';

export async function saveContactRequest(payload) {
  const db = getDb();
  const clean = {
    ...payload,
    createdAt: serverTimestamp(),
    status: 'new'
  };
  const ref = await addDoc(collection(db, 'contactRequests'), clean);

  // Tentative d'envoi d'e-mail via Cloud Function (si dispo)
  try {
    if (callSendContactEmail) {
      await callSendContactEmail({
        to: 'manager@senharvest.com',
        subject: `[SenHarvest] ${payload.subject || 'New inquiry'}`,
        message: `
Client: ${payload.name} <${payload.email}>
Phone: ${payload.phone || '-'}
Quantity: ${payload.quantity || '-'}
Destination: ${payload.destination || '-'}
Incoterm: ${payload.incoterm || '-'}
Payment: ${payload.payment || '-'}
---
${payload.message || '(no message)'}`
      });
    }
  } catch (e) {
    console.warn('sendContactEmail CF failed (continuing):', e);
  }

  return { id: ref.id };
}

// *Compat* avec ton import dans Contact.jsx
export const saveContact = saveContactRequest;