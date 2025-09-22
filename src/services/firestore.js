import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import { app } from "../config/firebase";

const db = getFirestore(app);

// CRUD: Proformas / Quotations
export const createDoc = async (type, data) => {
  const col = collection(db, type);
  return await addDoc(col, data);
};

export const getDocsList = async (type) => {
  const col = collection(db, type);
  const snap = await getDocs(col);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateDocById = async (type, id, data) => {
  const ref = doc(db, type, id);
  return await updateDoc(ref, data);
};

export const deleteDocById = async (type, id) => {
  const ref = doc(db, type, id);
  return await deleteDoc(ref);
};
