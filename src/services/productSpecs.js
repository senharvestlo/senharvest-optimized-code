// Firestore CRUD pour les spécifications produits
import { db } from '../config/firebase';
import {
  collection, doc, setDoc, getDoc, getDocs, deleteDoc,
  query, orderBy
} from 'firebase/firestore';

const COLL = 'product_specs';

/**
 * Structure conseillée d'un document "spec":
 * {
 *   id: 'cashew'            // = productKey (identique à BASE_PRODUCTS.key)
 *   productKey: 'cashew',
 *   lang: 'fr'|'en',        // langue de saisie principale
 *   updatedAt: <timestamp>,
 *   summary: 'texte court',
 *   sections: [
 *     { title: 'Quality/Grade', items: ['Moisture ≤ 8%', 'Defects ≤ 2%'] },
 *     { title: 'Packaging', items: ['50 kg PP+PE bags'] },
 *   ],
 *   fields: {
 *     hsCode: '0801.32.00',
 *     origin: 'Africa',
 *     moq: '5 t',
 *     incoterms: 'FOB/CIF',
 *   }
 * }
 */

// ----- READ -----
export async function getSpec(productKey) {
  const ref = doc(db, COLL, productKey);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() || {}) };
}

export async function listSpecs() {
  const coll = collection(db, COLL);
  const q = query(coll, orderBy('productKey'));
  const snap = await getDocs(q);
  const out = [];
  snap.forEach(d => out.push({ id: d.id, ...d.data() }));
  return out;
}

// ----- WRITE -----
export async function saveSpec(productKey, data) {
  const ref = doc(db, COLL, productKey);
  const payload = {
    ...data,
    productKey,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(ref, payload, { merge: true });
  return { id: productKey, ...payload };
}

export async function deleteSpec(productKey) {
  const ref = doc(db, COLL, productKey);
  await deleteDoc(ref);
  return true;
}

// Helpers
export function defaultSpec(productKey = '') {
  return {
    productKey,
    lang: 'fr',
    summary: '',
    sections: [
      { title: 'Qualité / Quality', items: [] },
      { title: 'Conditionnement / Packaging', items: [] },
      { title: 'Quantité / Quantity', items: [] },
    ],
    fields: {
      hsCode: '',
      origin: '',
      moq: '',
      incoterms: '',
    },
  };
}
