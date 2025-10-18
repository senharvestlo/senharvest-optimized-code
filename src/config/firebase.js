// src/config/firebase.js
// v9 modular, initialisation "lazy-safe" pour éviter "Service X is not available"
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.warn('⚠️ Firebase not configured. Set REACT_APP_FIREBASE_* env vars.');
}

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Lazy getters (important pour éviter le "Service X is not available")
export function getDb() {
  try {
    return getFirestore(app);
  } catch (e) {
    console.error('Firestore not available:', e);
    throw e;
  }
}

export function getFunctionsLazy() {
  try {
    const region = process.env.REACT_APP_FIREBASE_REGION || 'us-central1';
    return getFunctions(app, region);
  } catch (e) {
    console.error('Functions not available:', e);
    throw e;
  }
}

export function getStorageLazy() {
  try {
    return getStorage(app);
  } catch (e) {
    console.error('Firebase Storage not available:', e);
    throw e;
  }
}

// Flags & callables (lazy)
export const FIREBASE_READY = !!firebaseConfig.projectId;

export function getCallGrantAdmin() {
  try {
    return httpsCallable(getFunctionsLazy(), 'grantAdmin');
  } catch (e) {
    console.warn('callGrantAdmin not available:', e.message);
    return null;
  }
}

export function getCallSendContactEmail() {
  try {
    return httpsCallable(getFunctionsLazy(), 'sendContactEmail');
  } catch (e) {
    console.warn('callSendContactEmail not available:', e.message);
    return null;
  }
}

// Aliases pour compatibilité (retournent null si pas disponible)
export const callGrantAdmin = null; // Sera remplacé par getCallGrantAdmin() quand nécessaire
export const callSendContactEmail = null; // Sera remplacé par getCallSendContactEmail() quand nécessaire