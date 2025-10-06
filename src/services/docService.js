import { auth, getDb } from '../config/firebase';
import {
  addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  collection, doc, query, orderBy, limit, Timestamp
} from 'firebase/firestore';

function uid() { return auth.currentUser?.uid || null; }

export const COL_PROFORMAS  = 'proformas';
export const COL_QUOTATIONS = 'quotations';

// --- Proformas ---
export async function createProforma(data) {
  const db = await getDb();
  const ref = await addDoc(collection(db, COL_PROFORMAS), {
    ...data,
    uid: uid(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateProforma(id, data) {
  const db = await getDb();
  await updateDoc(doc(db, COL_PROFORMAS, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProforma(id) {
  const db = await getDb();
  await deleteDoc(doc(db, COL_PROFORMAS, id));
}

export async function getProforma(id) {
  const db = await getDb();
  const s = await getDoc(doc(db, COL_PROFORMAS, id));
  return s.exists() ? ({ id: s.id, ...s.data() }) : null;
}

export async function listProformas(limitCount = 50) {
  const db = await getDb();
  const q = query(
    collection(db, COL_PROFORMAS),
    orderBy('updatedAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// --- Quotations ---
export async function createQuotation(data) {
  const db = await getDb();
  const ref = await addDoc(collection(db, COL_QUOTATIONS), {
    ...data,
    uid: uid(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateQuotation(id, data) {
  const db = await getDb();
  await updateDoc(doc(db, COL_QUOTATIONS, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteQuotation(id) {
  const db = await getDb();
  await deleteDoc(doc(db, COL_QUOTATIONS, id));
}

export async function getQuotation(id) {
  const db = await getDb();
  const s = await getDoc(doc(db, COL_QUOTATIONS, id));
  return s.exists() ? ({ id: s.id, ...s.data() }) : null;
}

export async function listQuotations(limitCount = 50) {
  const db = await getDb();
  const q = query(
    collection(db, COL_QUOTATIONS),
    orderBy('updatedAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}