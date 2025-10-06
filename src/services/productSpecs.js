// src/services/productSpecs.js
import { getDb } from '../config/firebase';
import {
  collection, addDoc, doc, getDoc, updateDoc, deleteDoc,
  getDocs, query, orderBy, where, Timestamp
} from 'firebase/firestore';

const COL = 'product_specs';

export function defaultSpec() {
  return {
    productKey: '',    // ex: 'peanuts'
    lang: 'fr',
    title: '',
    bullets: [],       // ['Humidité ≤ 8%', 'Défauts ≤ 2%']
    pdfNotes: '',      // texte libre optionnel
    updatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
  };
}

export async function listSpecs({ productKey } = {}) {
  const db = await getDb();
  const ref = collection(db, COL);
  let q;
  
  if (productKey) {
    q = query(ref, where('productKey', '==', productKey));
  } else {
    q = query(ref, orderBy('updatedAt', 'desc'));
  }
  
  const snap = await getDocs(q);
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  if (productKey) {
    results.sort((a, b) => {
      const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0);
      const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0);
      return dateB - dateA;
    });
  }
  
  return results;
}

export async function getSpec(id) {
  const db = await getDb();
  const s = await getDoc(doc(db, COL, id));
  return s.exists() ? ({ id: s.id, ...s.data() }) : null;
}

export async function createSpec(payload) {
  const db = await getDb();
  const ref = await addDoc(collection(db, COL), {
    ...defaultSpec(),
    ...payload,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateSpec(id, payload) {
  const db = await getDb();
  await updateDoc(doc(db, COL, id), {
    ...payload,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteSpec(id) {
  const db = await getDb();
  await deleteDoc(doc(db, COL, id));
}