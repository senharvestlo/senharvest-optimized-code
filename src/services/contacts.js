// src/services/contacts.js
import { getDb } from '../config/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

export async function saveContactRequest(payload) {
  const db = await getDb();
  const docRef = await addDoc(collection(db, 'contact_requests'), {
    ...payload,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Alias pour compatibilité
export const saveContact = saveContactRequest;