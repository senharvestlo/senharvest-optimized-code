import { 
  collection, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc, 
  getDocs, 
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// Collections Firebase
const COLLECTIONS = {
  PROFORMA: 'proforma',
  TRADE_DOCS: 'trade_docs'
};

// ===== PROFORMA FUNCTIONS =====
export const saveProformaToFirebase = async (proformaData) => {
  if (!db) return null;
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
  if (!db) return null;
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
  if (!db) return null;
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
  if (!db) return [];
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
  if (!db) return () => {};
  const q = query(collection(db, COLLECTIONS.PROFORMA), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const proformas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(proformas);
  });
};

// ===== TRADE DOCS (PDF metadata) =====
export const saveTradeDocMeta = async (meta) => {
  if (!db) return null;
  // meta: { filename, path, url?, type, number, date, companyName, clientName, currency, total }
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TRADE_DOCS), {
      ...meta,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving trade doc meta:', error);
    throw error;
  }
};

export const listTradeDocs = async () => {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.TRADE_DOCS));
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error listing trade docs:', error);
    throw error;
  }
};

// ===== Additional Services (requested API) =====

// CONTACT
export async function submitContact(form) {
  if (!db) return false;
  const data = { ...form, createdAt: serverTimestamp(), source: 'website' };
  await addDoc(collection(db, 'contactSubmissions'), data);
  return true;
}

// TRADE DOCS CRUD
export async function saveTradeDoc(docId, payload) {
  if (!db) return null;
  const id = docId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  await setDoc(doc(db, 'tradeDocs', id), {
    ...payload,
    id,
    updatedAt: serverTimestamp(),
    createdAt: payload?.createdAt || serverTimestamp(),
  });
  return id;
}

export async function getTradeDoc(id) {
  if (!db) return null;
  const d = await getDoc(doc(db, 'tradeDocs', id));
  return d.exists() ? { id: d.id, ...d.data() } : null;
}

export async function listTradeDocsPaged({ pageSize = 20, cursor = null, type, searchNumber } = {}) {
  if (!db) return { items: [], nextCursor: null };
  const base = collection(db, 'tradeDocs');
  let qref = query(base, orderBy('updatedAt', 'desc'), limit(pageSize));
  if (type) qref = query(base, where('type', '==', type), orderBy('updatedAt', 'desc'), limit(pageSize));
  if (cursor) qref = query(base, orderBy('updatedAt', 'desc'), startAfter(cursor), limit(pageSize));
  const snap = await getDocs(qref);
  let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (searchNumber) items = items.filter(x => (x.number || '').toLowerCase().includes(searchNumber.toLowerCase()));
  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
  return { items, nextCursor };
}

export async function deleteTradeDoc(id) {
  if (!db) return;
  await deleteDoc(doc(db, 'tradeDocs', id));
}

// STORAGE: upload PDF
export async function uploadTradePdf(docId, blob) {
  if (!storage) return null;
  const r = ref(storage, `tradeDocs/${docId}.pdf`);
  await uploadBytes(r, blob, { contentType: 'application/pdf' });
  return await getDownloadURL(r);
}

// PRODUCT SPECS
export async function saveProductSpecs(productKey, specs) {
  if (!db) return null;
  await setDoc(doc(db, 'productSpecs', productKey), {
    key: productKey,
    specs,
    updatedAt: serverTimestamp(),
  });
}

export async function getProductSpecs(productKey) {
  if (!db) return { key: productKey, specs: '' };
  const d = await getDoc(doc(db, 'productSpecs', productKey));
  return d.exists() ? d.data() : { key: productKey, specs: '' };
}

export async function listProductSpecs() {
  if (!db) return [];
  const snap = await getDocs(collection(db, 'productSpecs'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}