import { getDb } from '../config/firebase';
import {
  collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp
} from 'firebase/firestore';

export async function listDocs(type) {
  const db = getDb();
  const snap = await getDocs(collection(db, `docs_${type}`));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getDocById(type, id) {
  const db = getDb();
  const ref = doc(db, `docs_${type}`, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createDoc(type, data) {
  const db = getDb();
  const ref = await addDoc(collection(db, `docs_${type}`), {
    ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
  return { id: ref.id };
}

export async function updateDocById(type, id, data) {
  const db = getDb();
  await updateDoc(doc(db, `docs_${type}`, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocById(type, id) {
  const db = getDb();
  await deleteDoc(doc(db, `docs_${type}`, id));
}

// Compat (là où ton code appelait "saveDoc")
export async function saveDoc(type, id, data) {
  if (!id) {
    const res = await createDoc(type, data);
    return res;
  }
  await updateDocById(type, id, data);
  return { id };
}