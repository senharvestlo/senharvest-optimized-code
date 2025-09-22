import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// CRA-compatible env configuration (use .env with REACT_APP_* keys)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE,
  messagingSenderId: process.env.REACT_APP_FB_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
};

// Initialize or reuse Firebase app (avoids HMR double init issues)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
