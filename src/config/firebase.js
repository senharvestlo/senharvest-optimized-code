// v9 modular, robuste + rétro-compat
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// ---- Chargement config depuis .env (Netlify) ----
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Petit log utile (masqué en prod si besoin)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔥 Firebase Config (masked):', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : '(missing)'
  });
}

// ---- Initialisation sûre ----
let app;
try {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
} catch (e) {
  console.error('❌ Firebase init error:', e);
}

// Instances paresseuses (évite "service ... not available")
let _db = null;
let _auth = null;
let _storage = null;
let _functions = null;
export const googleProvider = new GoogleAuthProvider();

export function getDb() {
  if (!_db) {
    _db = getFirestore(app);
  }
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

// ---- Exports attendus par ton code existant ----
export const FIREBASE_READY = !!app;
export { app };

// *Compat* : certains fichiers importaient `db` / `storage` / `functions`
export const db = (() => { try { return getDb(); } catch { return null; } })();
export const auth = (() => { try { return getAuthSafe(); } catch { return null; } })();
export const storage = (() => { try { return getStorageLazy(); } catch { return null; } })();
export const functions = (() => { try { return getFunctionsLazy(); } catch { return null; } })();

// Callables possibles (si Cloud Functions déployées)
import { httpsCallable } from 'firebase/functions';
export const callGrantAdmin = (() => {
  try { return httpsCallable(getFunctionsLazy(), 'grantAdmin'); } catch { return null; }
})();
export const callSendContactEmail = (() => {
  try { return httpsCallable(getFunctionsLazy(), 'sendContactEmail'); } catch { return null; }
})();