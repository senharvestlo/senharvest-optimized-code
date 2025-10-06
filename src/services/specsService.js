import { getDb } from '../config/firebase';
import {
  addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  collection, doc, query, orderBy, where, limit, Timestamp
} from 'firebase/firestore';

const COL = 'productSpecs';

export async function createSpec(productKey, data) {
  const db = await getDb();
  const ref = await addDoc(collection(db, COL), {
    productKey,
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateSpec(id, data) {
  const db = await getDb();
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteSpec(id) {
  const db = await getDb();
  await deleteDoc(doc(db, COL, id));
}

export async function getSpec(id) {
  const db = await getDb();
  const s = await getDoc(doc(db, COL, id));
  return s.exists() ? ({ id: s.id, ...s.data() }) : null;
}

export async function listSpecs(productKey) {
  const db = await getDb();
  const q = query(
    collection(db, COL),
    where('productKey', '==', productKey),
    orderBy('updatedAt', 'desc'),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}