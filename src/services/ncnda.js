import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  orderBy, query, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { getDb } from '../config/firebase';

const COL = 'ncndas';

export async function createNCNDA(data) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour createNCNDA');
    throw new Error('Service Firestore non disponible');
  }
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { id: ref.id };
}

export async function updateNCNDA(id, data) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour updateNCNDA');
    throw new Error('Service Firestore non disponible');
  }
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
  return { id };
}

export async function deleteNCNDA(id) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour deleteNCNDA');
    throw new Error('Service Firestore non disponible');
  }
  await deleteDoc(doc(db, COL, id));
  return { id };
}

export async function getNCNDA(id) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour getNCNDA');
    throw new Error('Service Firestore non disponible');
  }
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function listNCNDA() {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour listNCNDA');
    return []; // Retourne tableau vide au lieu de throw
  }
  const q = query(collection(db, COL), orderBy('updatedAt', 'desc'));
  const s = await getDocs(q);
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
}