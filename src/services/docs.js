import { getDb } from '../config/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

const COL = 'docs';

export async function listDocs() {
  const db = await getDb();
  const q = query(collection(db, COL), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getDoc(id) {
  const db = await getDb();
  const s = await getDoc(doc(db, COL, id));
  return s.exists() ? ({ id: s.id, ...s.data() }) : null;
}

export async function createDoc(payload) {
  const db = await getDb();
  const ref = await addDoc(collection(db, COL), {
    ...payload,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateDoc(id, payload) {
  const db = await getDb();
  await updateDoc(doc(db, COL, id), {
    ...payload,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteDoc(id) {
  const db = await getDb();
  await deleteDoc(doc(db, COL, id));
}