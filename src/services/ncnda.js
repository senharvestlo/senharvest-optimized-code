import { getDb } from '../config/firebase';
import {
  collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, limit
} from 'firebase/firestore';

const KIND = 'ncnda';

export async function listNCNDA({ max=200 } = {}) {
  const db = getDb();
  const q = query(collection(db, KIND), orderBy('updatedAt','desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createNCNDA(data) {
  const db = getDb();
  const ref = await addDoc(collection(db, KIND), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return { id: ref.id };
}

export async function getNCNDA(id) {
  const db = getDb();
  const snap = await getDoc(doc(db, KIND, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateNCNDA(id, data) {
  const db = getDb();
  await updateDoc(doc(db, KIND, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteNCNDA(id) {
  const db = getDb();
  await deleteDoc(doc(db, KIND, id));
}

// Compat
export const saveNCNDA = async (id, data) => {
  if (!id) return createNCNDA(data);
  await updateNCNDA(id, data);
  return { id };
};