import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Configuration Firebase SenHarvest
const firebaseConfig = {
  apiKey: "AIzaSyAvBSeB9QLHn3uvQqf__ATH2WKS2MN5Jxk",
  authDomain: "xidma-harvest.firebaseapp.com",
  projectId: "xidma-harvest",
  storageBucket: "xidma-harvest.firebasestorage.app",
  messagingSenderId: "6967237281",
  appId: "1:6967237281:web:03aa0a3ac4e8b54aebaee0",
  measurementId: "G-C4E4K51XG4"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore, Auth et Analytics
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
