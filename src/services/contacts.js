import { db, callSendContactEmail } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function saveContact(data) {
  await addDoc(collection(db, 'contacts'), { ...data, createdAt: new Date() });
  // email via Cloud Function
  await callSendContactEmail(data);
}
