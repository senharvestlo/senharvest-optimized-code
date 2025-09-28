import { db } from '../config/firebase';
import {
  addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  collection, doc, query, orderBy, where, limit, serverTimestamp
} from 'firebase/firestore';

const COL = 'productSpecs';

export async function createSpec(productKey, data) {
  const ref = await addDoc(collection(db, COL), {
    productKey,
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}
export async function updateSpec(id, data) {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}
export async function deleteSpec(id) {
  await deleteDoc(doc(db, COL, id));
}
export async function getSpec(id) {
  const s = await getDoc(doc(db, COL, id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
}
export async function listSpecs(productKey, max = 100) {
  const q = query(
    collection(db, COL),
    where('productKey', '==', productKey),
    orderBy('updatedAt', 'desc'),
    limit(max)
  );
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}
