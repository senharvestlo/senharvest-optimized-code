import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  orderBy, query, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { getDb } from '../config/firebase';

// CREATE
export async function createDoc(colName, data) {
  const db = getDb();
  const ref = await addDoc(collection(db, colName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { id: ref.id };
}

// READ one
export async function getDocById(colName, id) {
  const db = getDb();
  const snap = await getDoc(doc(db, colName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// LIST
export async function listDocs(colName) {
  const db = getDb();
  const q = query(collection(db, colName), orderBy('updatedAt', 'desc'));
  const s = await getDocs(q);
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
}

// UPDATE
export async function updateDocById(colName, id, data) {
  const db = getDb();
  await updateDoc(doc(db, colName, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
  return { id };
}

// DELETE
export async function deleteDocById(colName, id) {
  const db = getDb();
  await deleteDoc(doc(db, colName, id));
  return { id };
}

// *Compat* : certains écrans appellent saveDoc(col, id, data)
export async function saveDoc(colName, id, data) {
  if (!id || id === 'new') {
    return createDoc(colName, data); // retourne {id}
  }
  await updateDocById(colName, id, data);
  return { id };
}