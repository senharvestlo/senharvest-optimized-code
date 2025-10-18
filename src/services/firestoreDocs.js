// src/services/firestoreDocs.js
import {
  addDoc, updateDoc, getDoc, getDocs, deleteDoc,
  doc, collection, serverTimestamp, query, orderBy, limit
} from 'firebase/firestore';
import { getDb } from '../config/firebase';

export async function createDoc(kind, data) {
  const db = getDb();
  const col = collection(db, kind);
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(col, payload);
  return { id: ref.id, ...payload };
}

export async function updateDocById(kind, id, data) {
  const db = getDb();
  const ref = doc(db, kind, id);
  const payload = { ...data, updatedAt: serverTimestamp() };
  await updateDoc(ref, payload);
  return { id, ...payload };
}

export async function getDocById(kind, id) {
  const db = getDb();
  const ref = doc(db, kind, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function deleteDocById(kind, id) {
  const db = getDb();
  await deleteDoc(doc(db, kind, id));
}

export async function listDocs(kind, { order='updatedAt', desc=true, max=100 } = {}) {
  const db = getDb();
  const q = query(collection(db, kind), orderBy(order, desc ? 'desc' : 'asc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// compat pour ton code existant
export async function saveDoc(kind, id, data) {
  if (!id) return createDoc(kind, data);
  return updateDocById(kind, id, data);
}