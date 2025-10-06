import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from "firebase/firestore";

import { getDb } from "../config/firebase";

const COLLECTION_NAME = "contact_requests";

export const saveContactRequest = async (contactData) => {
  const db = await getDb();
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...contactData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving contact request:", error);
    throw error;
  }
};

export const getContactRequests = async () => {
  const db = await getDb();
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting contact requests:", error);
    throw error;
  }
};

export const updateContactRequest = async (id, updatedData) => {
  const db = await getDb();
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating contact request:", error);
    throw error;
  }
};

export const deleteContactRequest = async (id) => {
  const db = await getDb();
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting contact request:", error);
    throw error;
  }
};