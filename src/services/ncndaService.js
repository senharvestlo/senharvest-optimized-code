// src/services/ncndaService.js
import { auth, getDb } from '../config/firebase';
import {
  addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  collection, doc, query, orderBy, limit, Timestamp
} from 'firebase/firestore';

function uid() { return auth.currentUser?.uid || null; }

const COL = 'ncndas';

export async function createNCNDA(data) {
  const db = await getDb();
  const ref = await addDoc(collection(db, COL), {
    ...data,
    uid: uid(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateNCNDA(id, data) {
  const db = await getDb();
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteNCNDA(id) {
  const db = await getDb();
  await deleteDoc(doc(db, COL, id));
}

export async function getNCNDA(id) {
  const db = await getDb();
  const s = await getDoc(doc(db, COL, id));
  return s.exists() ? ({ id: s.id, ...s.data() }) : null;
}

export async function listNCNDAs(limitCount = 50) {
  const db = await getDb();
  const q = query(
    collection(db, COL),
    orderBy('updatedAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}