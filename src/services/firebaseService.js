import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, orderBy, serverTimestamp, updateDoc, deleteDoc, where, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// --- Collections ---
const COL_TRADE = 'trade_docs';
const COL_CONTACT = 'contact_msgs';

// --- Trade docs CRUD ---
export async function saveTradeDoc(id, data) {
  if (!db) return null;
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

export async function listTradeDocs(arg) {
  if (!db) return { items: [] };
  // Backward compat: allow listTradeDocs('quotation')
  const type = typeof arg === 'string' ? arg : (arg && arg.type) ? arg.type : null;

  let qref;
  if (type) {
    qref = query(collection(db, COL_TRADE), where('type', '==', type), orderBy('updatedAt', 'desc'));
  } else {
    qref = query(collection(db, COL_TRADE), orderBy('updatedAt', 'desc'));
  }
  const snap = await getDocs(qref);
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return { items };
}

export async function getTradeDoc(id) {
  if (!db) return null;
  const refDoc = doc(db, COL_TRADE, id);
  const snap = await getDoc(refDoc);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function deleteTradeDoc(id) {
  if (!db) return;
  await deleteDoc(doc(db, COL_TRADE, id));
}

export async function uploadTradePdf(id, blob) {
  if (!storage) return null;
  const storageRef = ref(storage, `${COL_TRADE}/${id}.pdf`);
  await uploadBytes(storageRef, blob, { contentType: 'application/pdf' });
  const url = await getDownloadURL(storageRef);
  if (db) {
    await updateDoc(doc(db, COL_TRADE, id), { pdfUrl: url, pdfUpdatedAt: serverTimestamp() });
  }
  return url;
}

// --- Contact messages ---
export async function saveContactMessage(data) {
  if (!db) return null;
  const payload = {
    ...data,
    status: 'received',
    createdAt: serverTimestamp(),
  };
  const refCreated = await addDoc(collection(db, COL_CONTACT), payload);
  return refCreated.id;
}