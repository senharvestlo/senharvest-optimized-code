import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function saveContactRequest(payload) {
  await addDoc(collection(db, 'contact_requests'), {
    ...payload,
    createdAt: serverTimestamp(),
    status: 'new'
  });
}

// Compat pour ton Contact.jsx
export const saveContact = saveContactRequest;