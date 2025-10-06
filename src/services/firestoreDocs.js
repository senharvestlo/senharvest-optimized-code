import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  orderBy, query, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { getDb } from '../config/firebase';

// CREATE
export async function createDoc(colName, data) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour createDoc');
    throw new Error('Service Firestore non disponible');
  }
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
  if (!db) {
    console.error('❌ Firestore non disponible pour getDocById');
    throw new Error('Service Firestore non disponible');
  }
  const snap = await getDoc(doc(db, colName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// LIST
export async function listDocs(colName) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour listDocs');
    return []; // Retourne tableau vide au lieu de throw
  }
  const q = query(collection(db, colName), orderBy('updatedAt', 'desc'));
  const s = await getDocs(q);
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
}

// UPDATE
export async function updateDocById(colName, id, data) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour updateDocById');
    throw new Error('Service Firestore non disponible');
  }
  await updateDoc(doc(db, colName, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
  return { id };
}

// DELETE
export async function deleteDocById(colName, id) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour deleteDocById');
    throw new Error('Service Firestore non disponible');
  }
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