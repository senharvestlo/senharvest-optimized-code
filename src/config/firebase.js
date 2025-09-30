import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Map both REACT_APP_FB_* and REACT_APP_FIREBASE_* env names
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_SENDER_ID || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID || process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
export const FIREBASE_READY = requiredKeys.every((k) => Boolean(firebaseConfig[k]));

export function getFirebaseApp() {
  if (!FIREBASE_READY) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const app = getFirebaseApp();
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export default app;
