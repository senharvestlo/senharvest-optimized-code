// src/services/ncnda.js
import { db } from '../config/firebase';
import {
  collection, addDoc, doc, getDoc, updateDoc, deleteDoc,
  getDocs, query, orderBy
} from 'firebase/firestore';

const COL = 'ncnda';

export async function listNCNDA() {
  const q = query(collection(db, COL), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getNCNDA(id) {
  const ref = doc(db, COL, id);
  const s = await getDoc(ref);
  return s.exists() ? ({ id: s.id, ...s.data() }) : null;
}

export async function createNCNDA(payload) {
  const ref = await addDoc(collection(db, COL), {
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return ref.id;
}

export async function updateNCNDA(id, payload) {
  await updateDoc(doc(db, COL, id), {
    ...payload,
    updatedAt: new Date(),
  });
}

export async function deleteNCNDA(id) {
  await deleteDoc(doc(db, COL, id));
}
