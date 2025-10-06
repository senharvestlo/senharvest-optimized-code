// src/services/ncnda.js
import { getDb } from '../config/firebase';
import { addDoc, collection, doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

const COL = 'ncnda';

export async function createNCNDA(data) {
  const db = await getDb();
  const ref = await addDoc(collection(db, COL), { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return ref.id;
}
export async function updateNCNDA(id, data) {
  const db = await getDb();
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: Timestamp.now() });
}
export async function getNCNDA(id) {
  const db = await getDb();
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export async function deleteNCNDA(id) {
  const db = await getDb();
  await deleteDoc(doc(db, COL, id));
}

// Alias pour compatibilité
export const listNCNDA = async () => {
  const db = await getDb();
  const q = query(collection(db, COL), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};