// ✅ src/config/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔧 Configuration Firebase (mets ici tes vraies clés)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:demo123",
};

// Avertissement si les variables d'environnement ne sont pas définies
if (!process.env.REACT_APP_FIREBASE_PROJECT_ID) {
  console.warn('⚠️ Variables d\'environnement Firebase non définies. Utilisation des valeurs de démonstration.');
  console.warn('📝 Créez un fichier .env avec vos vraies clés Firebase pour la production.');
}

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