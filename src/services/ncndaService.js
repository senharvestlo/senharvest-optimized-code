// src/services/ncndaService.js
import { db } from '../config/firebase';
import {
  addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  collection, doc, query, orderBy, limit, serverTimestamp
} from 'firebase/firestore';

const COL = 'ncndas';

export async function createNcnda(data) {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateNcnda(id, data) {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteNcnda(id) {
  await deleteDoc(doc(db, COL, id));
}

export async function getNcnda(id) {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function listNcndas({ max = 200 } = {}) {
  const q = query(collection(db, COL), orderBy('updatedAt', 'desc'), limit(max));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}
