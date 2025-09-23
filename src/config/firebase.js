import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// CRA-compatible env configuration (use .env with REACT_APP_* keys)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY || "AIzaSyAvBSeB9QLHn3uvQqf__ATH2WKS2MN5Jxk",
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN || "xidma-harvest.firebaseapp.com",
  projectId: process.env.REACT_APP_FB_PROJECT_ID || "xidma-harvest",
  storageBucket: process.env.REACT_APP_FB_STORAGE || "xidma-harvest.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FB_SENDER_ID || "6967237281",
  appId: process.env.REACT_APP_FB_APP_ID || "1:6967237281:web:03aa0a3ac4e8b54aebaee0",
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID || "G-C4E4K51XG4"
};

// Only initialize when required keys exist to avoid runtime error in dev
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
export const FIREBASE_READY = requiredKeys.every((k) => Boolean(firebaseConfig[k]));

// Initialize or reuse Firebase app (avoids HMR double init issues)
let app = null;
if (FIREBASE_READY) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} else {
  // eslint-disable-next-line no-console
  console.warn('[Firebase] Missing configuration (.env). Skipping Firebase init in dev.');
}

// Export services
let authInstance = null;
if (app) {
  try {
    authInstance = initializeAuth(app, { persistence: browserLocalPersistence });
  } catch (e) {
    authInstance = getAuth(app);
  }
}
export const auth = authInstance;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export default app;
