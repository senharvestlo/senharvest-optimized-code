// src/services/firestoreDocs.js
import { getDb } from '../config/firebase';
import {
  addDoc, collection, doc, getDoc, getDocs,
  orderBy, query, updateDoc, deleteDoc, Timestamp,
} from 'firebase/firestore';

export async function createDoc(col, data) {
  const db = await getDb();
  const ref = await addDoc(collection(db, col), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateDocById(col, id, data) {
  const db = await getDb();
  await updateDoc(doc(db, col, id), { ...data, updatedAt: Timestamp.now() });
}

export async function getDocById(col, id) {
  const db = await getDb();
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function listDocs(col) {
  const db = await getDb();
  const q = query(collection(db, col), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteDocById(col, id) {
  const db = await getDb();
  await deleteDoc(doc(db, col, id));
}

// Alias pour compatibilité
export const saveDoc = async (type, id, data) => {
  if (id) {
    return updateDocById(type, id, data);
  } else {
    const newId = await createDoc(type, data);
    return { id: newId, ...data };
  }
};