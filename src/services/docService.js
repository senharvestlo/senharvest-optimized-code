import { auth, db } from '@/config/firebase';
import {
  addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  collection, doc, query, orderBy, limit, serverTimestamp
} from 'firebase/firestore';

function uid() { return auth.currentUser?.uid || null; }

export const COL_PROFORMAS  = 'proformas';
export const COL_QUOTATIONS = 'quotations';

export async function createProforma(data) {
  const ownerUid = uid();
  if (!ownerUid) throw new Error('Not authenticated');
  const ref = await addDoc(collection(db, COL_PROFORMAS), {
    ...data, ownerUid, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
  return ref.id;
}
export async function updateProforma(id, data) {
  const ref = doc(db, COL_PROFORMAS, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}
export async function deleteProforma(id) {
  await deleteDoc(doc(db, COL_PROFORMAS, id));
}
export async function getProforma(id) {
  const s = await getDoc(doc(db, COL_PROFORMAS, id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
}
export async function listProformas(max = 200) {
  const q = query(collection(db, COL_PROFORMAS), orderBy('updatedAt', 'desc'), limit(max));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Quotations
export async function createQuotation(data) {
  const ownerUid = uid();
  if (!ownerUid) throw new Error('Not authenticated');
  const ref = await addDoc(collection(db, COL_QUOTATIONS), {
    ...data, ownerUid, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
  });
  return ref.id;
}
export async function updateQuotation(id, data) {
  const ref = doc(db, COL_QUOTATIONS, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}
export async function deleteQuotation(id) {
  await deleteDoc(doc(db, COL_QUOTATIONS, id));
}
export async function getQuotation(id) {
  const s = await getDoc(doc(db, COL_QUOTATIONS, id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
}
export async function listQuotations(max = 200) {
  const q = query(collection(db, COL_QUOTATIONS), orderBy('updatedAt', 'desc'), limit(max));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}
