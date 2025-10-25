// v9 modular
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, setPersistence,
  browserLocalPersistence, onAuthStateChanged, signOut
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// ---- ENV (CRA) ----
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (Object.values(firebaseConfig).some((v) => !v)) {
  // Aide au debug
  // eslint-disable-next-line no-console
  console.error('❌ Firebase n\'est pas configuré. Ajoutez vos REACT_APP_FIREBASE_* dans Netlify/.env');
}

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Certains environnements (SSR / headers stricts) rendent des services indisponibles si
// on les demande trop tôt. On renvoie des getters "paresseux".
export const getDb = () => getFirestore(app);
export const ensureDb = () => getFirestore(app);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
setPersistence(auth, browserLocalPersistence).catch(() => {});

// Functions & Storage (optionnels, catch si indisponible)
let _functions = null, _storage = null;
try { _functions = getFunctions(app); } catch { /* noop */ }
try { _storage = getStorage(app); } catch { /* noop */ }

export const functions = _functions;
export const storage = _storage;
export const appRef = app;

// Helper flag
export const FIREBASE_READY = !!app;

// Expose small helpers
export const onAuth = (cb) => onAuthStateChanged(auth, cb);
export const logout = () => signOut(auth);