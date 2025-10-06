import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, orderBy, serverTimestamp, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDb, getStorageLazy } from '../config/firebase';

// --- Collections ---
const COL_TRADE = 'trade_docs';
const COL_CONTACT = 'contact_msgs';

// --- Trade docs CRUD ---
export async function saveTradeDoc(id, data) {
  const db = await getDb();
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
    createdAt: data?.createdAt || serverTimestamp(),
  };

  if (!id) {
    const refCreated = await addDoc(collection(db, COL_TRADE), payload);
    return refCreated.id;
  } else {
    await setDoc(doc(db, COL_TRADE, id), payload, { merge: true });
    return id;
  }
}

export async function getTradeDoc(id) {
  const db = await getDb();
  const docRef = doc(db, COL_TRADE, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
}

export async function listTradeDocs(limitCount = 50) {
  const db = await getDb();
  const q = query(collection(db, COL_TRADE), orderBy('updatedAt', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function deleteTradeDoc(id) {
  const db = await getDb();
  await deleteDoc(doc(db, COL_TRADE, id));
}

// --- Contact messages CRUD ---
export async function saveContactMessage(data) {
  const db = await getDb();
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
  };
  
  const refCreated = await addDoc(collection(db, COL_CONTACT), payload);
  return refCreated.id;
}

export async function listContactMessages(limitCount = 100) {
  const db = await getDb();
  const q = query(collection(db, COL_CONTACT), orderBy('createdAt', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// --- File upload utilities ---
export async function uploadFile(file, path) {
  const storage = await getStorageLazy();
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

// --- Search utilities ---
export async function searchTradeDocs(searchTerm) {
  const db = await getDb();
  const searchLower = searchTerm.toLowerCase();
  
  // Search by number (reference)
  const q1 = query(collection(db, COL_TRADE), where('number', '>=', searchLower), where('number', '<=', searchLower + '\uf8ff'));
  const q2 = query(collection(db, COL_TRADE), where('buyer.name', '>=', searchLower), where('buyer.name', '<=', searchLower + '\uf8ff'));
  
  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  
  const results = new Map();
  snap1.docs.forEach(doc => results.set(doc.id, { id: doc.id, ...doc.data() }));
  snap2.docs.forEach(doc => results.set(doc.id, { id: doc.id, ...doc.data() }));
  
  return Array.from(results.values());
}