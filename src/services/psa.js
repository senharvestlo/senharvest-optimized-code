// src/services/psa.js
import {
  addDoc, updateDoc, getDoc, getDocs, deleteDoc,
  doc, collection, serverTimestamp, query, orderBy, limit
} from 'firebase/firestore';
import { getDb } from '../config/firebase';

const KIND = 'psa';

export async function listPSA({ max=200 } = {}) {
  const db = getDb();
  const q = query(collection(db, KIND), orderBy('updatedAt','desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createPSA(data) {
  const db = getDb();
  const ref = await addDoc(collection(db, KIND), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return { id: ref.id };
}

export async function getPSA(id) {
  const db = getDb();
  const snap = await getDoc(doc(db, KIND, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updatePSA(id, data) {
  const db = getDb();
  await updateDoc(doc(db, KIND, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deletePSA(id) {
  const db = getDb();
  await deleteDoc(doc(db, KIND, id));
}