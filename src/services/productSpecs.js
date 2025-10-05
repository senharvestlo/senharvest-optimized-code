import { db } from '../config/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';

const COL = 'product_specs';

export const defaultSpec = {
  productKey: '',
  name: '',
  description: '',
  specifications: {},
  images: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

export async function listSpecs() {
  const q = query(collection(db, COL), orderBy('productKey'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getSpec(productKey) {
  const snap = await getDoc(doc(db, COL, productKey));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveSpec(productKey, payload) {
  await setDoc(doc(db, COL, productKey), { ...payload, updatedAt: new Date() }, { merge: true });
}

export async function deleteSpec(productKey) {
  await deleteDoc(doc(db, COL, productKey));
}