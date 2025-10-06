// src/config/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,            // <— important
} from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error('⚠️ Firebase env vars manquantes. Vérifie .env/.Netlify.');
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let _db, _auth, _storage, _functions;

// 👉 Force l'enregistrement Firestore (évite "service not available")
try {
  initializeFirestore(app, {
    ignoreUndefinedProperties: true,
  });
} catch (_) {
  // initializeFirestore ne peut être appelé qu'une fois : ignore si déjà fait
}

export function getDb() {
  if (!_db) _db = getFirestore(app);
  return _db;
}
export function ensureDb() { return getDb(); }

export function getAuthSafe() {
  if (!_auth) _auth = getAuth(app);
  return _auth;
}

export function getStorageLazy() {
  if (!_storage) _storage = getStorage(app);
  return _storage;
}

export function getFunctionsLazy(region = (process.env.REACT_APP_FIREBASE_REGION || 'us-central1')) {
  if (!_functions) _functions = getFunctions(app, region);
  return _functions;
}

export const googleProvider = new GoogleAuthProvider();

// Exports "compat" attendus par tes anciens imports
export const db = (() => { try { return getDb(); } catch { return null; } })();
export const auth = (() => { try { return getAuthSafe(); } catch { return null; } })();
export const storage = (() => { try { return getStorageLazy(); } catch { return null; } })();
export const functions = (() => { try { return getFunctionsLazy(); } catch { return null; } })();

export const FIREBASE_READY = !!app;

// Callables si CF dispos
export const callGrantAdmin = (() => {
  try { return httpsCallable(getFunctionsLazy(), 'grantAdmin'); } catch { return null; }
})();
export const callSendContactEmail = (() => {
  try { return httpsCallable(getFunctionsLazy(), 'sendContactEmail'); } catch { return null; }
})();

export { app };