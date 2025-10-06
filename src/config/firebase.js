// src/config/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
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

// Instances paresseuses avec gestion d'erreur robuste
let _db = null;
let _auth = null;
let _storage = null;
let _functions = null;

export function getDb() {
  if (!_db) {
    try {
      _db = getFirestore(app);
    } catch (error) {
      console.error('❌ Erreur getFirestore:', error);
      // Retry une fois après un délai
      setTimeout(() => {
        try {
          _db = getFirestore(app);
        } catch (retryError) {
          console.error('❌ Retry getFirestore failed:', retryError);
        }
      }, 1000);
    }
  }
  return _db;
}

export function ensureDb() { 
  return getDb(); 
}

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

// Exports "compat" avec gestion d'erreur
export const db = (() => { 
  try { 
    return getDb(); 
  } catch (error) {
    console.warn('⚠️ db export failed, returning null:', error.message);
    return null; 
  } 
})();

export const auth = (() => { 
  try { 
    return getAuthSafe(); 
  } catch (error) {
    console.warn('⚠️ auth export failed, returning null:', error.message);
    return null; 
  } 
})();

export const storage = (() => { 
  try { 
    return getStorageLazy(); 
  } catch (error) {
    console.warn('⚠️ storage export failed, returning null:', error.message);
    return null; 
  } 
})();

export const functions = (() => { 
  try { 
    return getFunctionsLazy(); 
  } catch (error) {
    console.warn('⚠️ functions export failed, returning null:', error.message);
    return null; 
  } 
})();

export const FIREBASE_READY = !!app;

// Callables avec gestion d'erreur
export const callGrantAdmin = (() => {
  try { 
    return httpsCallable(getFunctionsLazy(), 'grantAdmin'); 
  } catch (error) {
    console.warn('⚠️ callGrantAdmin failed:', error.message);
    return null; 
  }
})();

export const callSendContactEmail = (() => {
  try { 
    return httpsCallable(getFunctionsLazy(), 'sendContactEmail'); 
  } catch (error) {
    console.warn('⚠️ callSendContactEmail failed:', error.message);
    return null; 
  }
})();

export { app };