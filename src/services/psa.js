import { db } from '../config/firebase';
import {
  collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, limit
} from 'firebase/firestore';

const KIND = 'psa';

export async function listPSA({ max=200 } = {}) {
  const q = query(collection(db, KIND), orderBy('updatedAt','desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createPSA(data) {
  const ref = await addDoc(collection(db, KIND), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return { id: ref.id };
}

export async function getPSA(id) {
  const snap = await getDoc(doc(db, KIND, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updatePSA(id, data) {
  await updateDoc(doc(db, KIND, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deletePSA(id) {
  await deleteDoc(doc(db, KIND, id));
}

// Compat
export const savePSA = async (id, data) => {
  if (!id) return createPSA(data);
  await updatePSA(id, data);
  return { id };
};