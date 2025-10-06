// src/config/firebase.js
import { initializeApp, getApps, getApp, SDK_VERSION } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

// 1) Config depuis env
const cfg = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID, // optionnel
};

(function assertEnv(o) {
  const missing = Object.entries(o)
    .filter(([k, v]) => !v && k !== 'measurementId')
    .map(([k]) => k);
  if (missing.length) {
    const msg = `Firebase n'est pas configuré. Variables manquantes: ${missing.join(', ')}.
Ajoutez REACT_APP_FIREBASE_* dans .env.local et dans Netlify, puis redeploy.`;
    console.error(msg);
    throw new Error(msg);
  }
})(cfg);

// 2) Init unique
const app = getApps().length ? getApp() : initializeApp(cfg);

// 3) Services non "casse-gueule"
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const region = process.env.REACT_APP_FIREBASE_FUNCTIONS_REGION || process.env.REACT_APP_FIREBASE_REGION || 'us-central1';
const functions = getFunctions(app, region);

// 4) Firestore en lazy
let _dbPromise = null;
export function getDb() {
  if (!_dbPromise) {
    _dbPromise = import('firebase/firestore').then(async (m) => {
      const { getFirestore, enableIndexedDbPersistence } = m;
      const db = getFirestore(app);
      try { await enableIndexedDbPersistence(db); } catch (_) {}
      return db;
    });
  }
  return _dbPromise;
}
export async function ensureDb() { return getDb(); }

// 5) Storage en lazy (évite "Service storage is not available")
let _storagePromise = null;
export function getStorageLazy() {
  if (!_storagePromise) {
    _storagePromise = import('firebase/storage').then((m) => {
      const { getStorage } = m;
      return getStorage(app);
    });
  }
  return _storagePromise;
}

export { app, auth, functions, googleProvider };
export const FIREBASE_READY = true;

console.log('🔥 Firebase SDK', SDK_VERSION, 'Project:', cfg.projectId);