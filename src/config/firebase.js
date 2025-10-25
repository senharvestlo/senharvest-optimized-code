// ✅ Exemple de config Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const appRef = initializeApp(firebaseConfig);
export const auth = getAuth(appRef);
export const db = getFirestore(appRef);
export const googleProvider = new GoogleAuthProvider();

// Utilitaire pour attendre que Firebase soit prêt
export const onAuth = (callback) => onAuthStateChanged(auth, callback);