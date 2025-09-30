// src/services/firestoreDocs.js
import {
  collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Choix: collections séparées => plus simple et lisible
const COLL = {
  quotation: 'quotations',
  proforma: 'proformas',
};

// Sanitizer minimal
const clean = (o) => JSON.parse(JSON.stringify(o ?? {}));

// ----- CRUD -----
export async function createDoc(type, data) {
  const coll = collection(db, COLL[type]);
  const payload = {
    ...clean(data),
    type,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(coll, payload);
  return { id: ref.id, ...payload };
}

export async function saveDoc(type, id, data) {
  const ref = doc(db, COLL[type], id);
  const payload = {
    ...clean(data),
    type,
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, payload, { merge: true });
  return { id, ...payload };
}

export async function updateDocPartial(type, id, partial) {
  const ref = doc(db, COLL[type], id);
  await updateDoc(ref, { ...clean(partial), updatedAt: serverTimestamp() });
  const snap = await getDoc(ref);
  return { id, ...(snap.data() || {}) };
}

export async function getDocById(type, id) {
  const ref = doc(db, COLL[type], id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() || {}) };
}

export async function listDocs(type, opts = {}) {
  const coll = collection(db, COLL[type]);

  if (opts.search && opts.search.trim()) {
    // Recherche simple sur number (réf) ou buyer.name
    const term = opts.search.trim();
    const byNumber = query(coll, where('number', '>=', term), where('number', '<=', term + '\uf8ff'), limit(20));
    const byBuyer = query(coll, where('buyer.name', '>=', term), where('buyer.name', '<=', term + '\uf8ff'), limit(20));
    const [s1, s2] = await Promise.all([getDocs(byNumber), getDocs(byBuyer)]);
    const map = new Map();
    s1.forEach(d => map.set(d.id, { id: d.id, ...d.data() }));
    s2.forEach(d => map.set(d.id, { id: d.id, ...d.data() }));
    return Array.from(map.values());
  }

  // Liste récente
  const q = query(coll, orderBy('updatedAt', 'desc'), limit(opts.limit || 50));
  const snap = await getDocs(q);
  const out = [];
  snap.forEach(d => out.push({ id: d.id, ...d.data() }));
  return out;
}

export async function deleteDocById(type, id) {
  const ref = doc(db, COLL[type], id);
  await deleteDoc(ref);
  return true;
}
