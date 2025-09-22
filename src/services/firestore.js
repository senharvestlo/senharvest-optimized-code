import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../config/firebase";

// CRUD: Proformas / Quotations
export const createDoc = async (type, data) => {
  if (!db) { console.warn("Firestore not initialized, createDoc skipped."); return null; }
  const col = collection(db, type);
  return await addDoc(col, data);
};

export const getDocsList = async (type) => {
  if (!db) { console.warn("Firestore not initialized, getDocsList skipped."); return []; }
  const col = collection(db, type);
  const snap = await getDocs(col);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateDocById = async (type, id, data) => {
  if (!db) { console.warn("Firestore not initialized, updateDocById skipped."); return null; }
  const ref = doc(db, type, id);
  return await updateDoc(ref, data);
};

export const deleteDocById = async (type, id) => {
  if (!db) { console.warn("Firestore not initialized, deleteDocById skipped."); return null; }
  const ref = doc(db, type, id);
  return await deleteDoc(ref);
};
