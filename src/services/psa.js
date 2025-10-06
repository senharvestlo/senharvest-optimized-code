// src/services/psa.js
import { getDb } from '../config/firebase';
import { addDoc, collection, doc, getDoc, updateDoc, deleteDoc, Timestamp, query, orderBy, getDocs } from 'firebase/firestore';

const COL = 'psa';

export async function createPSA(data) {
  const db = await getDb();
  const ref = await addDoc(collection(db, COL), { ...data, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return ref.id;
}
export async function updatePSA(id, data) {
  const db = await getDb();
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: Timestamp.now() });
}
export async function getPSA(id) {
  const db = await getDb();
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export async function deletePSA(id) {
  const db = await getDb();
  await deleteDoc(doc(db, COL, id));
}

// Alias pour compatibilité
export const listPSA = async () => {
  const db = await getDb();
  const q = query(collection(db, COL), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};