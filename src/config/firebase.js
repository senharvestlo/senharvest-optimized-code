import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Cross-env Firebase configuration (supports Vite and CRA)
const firebaseConfig = {
  apiKey: (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_FB_API_KEY) || process.env.REACT_APP_FB_API_KEY,
  authDomain: (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_FB_AUTH_DOMAIN) || process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_FB_PROJECT_ID) || process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_FB_STORAGE) || process.env.REACT_APP_FB_STORAGE,
  messagingSenderId: (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_FB_SENDER_ID) || process.env.REACT_APP_FB_SENDER_ID,
  appId: (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_FB_APP_ID) || process.env.REACT_APP_FB_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
