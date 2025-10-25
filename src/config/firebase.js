// ✅ src/config/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔧 Configuration Firebase (mets ici tes vraies clés)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// ✅ Initialisation
export const appRef = initializeApp(firebaseConfig);

// Authentification
export const auth = getAuth(appRef);
export const googleProvider = new GoogleAuthProvider();

// Firestore Database
export const db = getFirestore(appRef);

// Helper pour obtenir la DB si besoin (pour compatibilité avec ton ancien code)
export const getDb = () => db;

// Storage (pour images, PDF, etc.)
export const storage = getStorage(appRef);

// Écoute d'état d'authentification
export const onAuth = (callback) => onAuthStateChanged(auth, callback);