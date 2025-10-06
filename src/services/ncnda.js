import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  orderBy, query, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { getDb } from '../config/firebase';

const COL = 'ncndas';

export async function createNCNDA(data) {
  const db = getDb();
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { id: ref.id };
}
export async function updateNCNDA(id, data) {
  const db = getDb();
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
  return { id };
}
export async function deleteNCNDA(id) {
  const db = getDb();
  await deleteDoc(doc(db, COL, id));
  return { id };
}
export async function getNCNDA(id) {
  const db = getDb();
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
export async function listNCNDA() {
  const db = getDb();
  const q = query(collection(db, COL), orderBy('updatedAt', 'desc'));
  const s = await getDocs(q);
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
}