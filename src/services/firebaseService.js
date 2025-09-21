import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collections Firebase
const COLLECTIONS = {
  PROFORMA: 'proforma'
};

// ===== PROFORMA FUNCTIONS =====
export const saveProformaToFirebase = async (proformaData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PROFORMA), {
      ...proformaData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving proforma to Firebase:', error);
    throw error;
  }
};

export const updateProformaInFirebase = async (proformaId, proformaData) => {
  try {
    const proformaRef = doc(db, COLLECTIONS.PROFORMA, proformaId);
    await updateDoc(proformaRef, {
      ...proformaData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating proforma in Firebase:', error);
    throw error;
  }
};

export const getProformaFromFirebase = async (proformaId) => {
  try {
    const proformaRef = doc(db, COLLECTIONS.PROFORMA, proformaId);
    const proformaSnap = await getDoc(proformaRef);
    
    if (proformaSnap.exists()) {
      return { id: proformaSnap.id, ...proformaSnap.data() };
    } else {
      throw new Error('Proforma not found');
    }
  } catch (error) {
    console.error('Error getting proforma from Firebase:', error);
    throw error;
  }
};

export const getAllProformasFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.PROFORMA));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting proformas from Firebase:', error);
    throw error;
  }
};

// ===== REAL-TIME LISTENERS =====
export const listenToProformas = (callback) => {
  const q = query(collection(db, COLLECTIONS.PROFORMA), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const proformas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(proformas);
  });
};