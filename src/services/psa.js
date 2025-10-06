import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  orderBy, query, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { getDb } from '../config/firebase';

const COL = 'psa_contracts';

export async function createPSA(data) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour createPSA');
    throw new Error('Service Firestore non disponible');
  }
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { id: ref.id };
}

export async function updatePSA(id, data) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour updatePSA');
    throw new Error('Service Firestore non disponible');
  }
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp()
  });
  return { id };
}

export async function deletePSA(id) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour deletePSA');
    throw new Error('Service Firestore non disponible');
  }
  await deleteDoc(doc(db, COL, id));
  return { id };
}

export async function getPSA(id) {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour getPSA');
    throw new Error('Service Firestore non disponible');
  }
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function listPSA() {
  const db = getDb();
  if (!db) {
    console.error('❌ Firestore non disponible pour listPSA');
    return []; // Retourne tableau vide au lieu de throw
  }
  const q = query(collection(db, COL), orderBy('updatedAt', 'desc'));
  const s = await getDocs(q);
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
}