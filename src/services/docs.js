import { db } from '../config/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';

const COL = 'docs';

export async function listDocs() {
  const q = query(collection(db, COL), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getDocById(id) {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createDoc(payload) {
  return addDoc(collection(db, COL), {
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
    type: payload?.type || 'proforma', // 'proforma' | 'quotation'
  });
}

export async function updateDocById(id, payload) {
  await updateDoc(doc(db, COL, id), { ...payload, updatedAt: new Date() });
}

export async function deleteDocById(id) {
  await deleteDoc(doc(db, COL, id));
}
