// src/services/contacts.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '../config/firebase';

const CF_ENDPOINT =
  process.env.REACT_APP_CF_SENDCONTACT_URL ||
  'https://us-central1-xidma-harvest.cloudfunctions.net/sendContact';

export async function saveContactRequest(payload) {
  const db = getDb();
  const clean = {
    ...payload,
    toEmail: 'manager@senharvest.com',
    createdAt: serverTimestamp(),
  };
  await addDoc(collection(db, 'contactRequests'), clean);
  try {
    await fetch(CF_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clean),
    });
  } catch (e) {
    console.warn('Email CF failed, but Firestore saved.', e);
  }
}

// alias attendu par Contact.jsx
export const saveContact = saveContactRequest;