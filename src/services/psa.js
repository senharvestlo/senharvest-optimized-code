// src/services/psa.js
import { db } from '../config/firebase';
import {
  collection, addDoc, doc, getDoc, updateDoc, deleteDoc,
  getDocs, query, orderBy
} from 'firebase/firestore';

const COL = 'psa'; // Profit-Sharing Agreements

export async function listPSA() {
  const q = query(collection(db, COL), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getPSA(id) {
  const ref = doc(db, COL, id);
  const s = await getDoc(ref);
  return s.exists() ? ({ id: s.id, ...s.data() }) : null;
}

export async function createPSA(payload) {
  const ref = await addDoc(collection(db, COL), {
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return ref.id;
}

export async function updatePSA(id, payload) {
  await updateDoc(doc(db, COL, id), {
    ...payload,
    updatedAt: new Date(),
  });
}

export async function deletePSA(id) {
  await deleteDoc(doc(db, COL, id));
}
