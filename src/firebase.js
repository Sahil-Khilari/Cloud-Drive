import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCl00BM2O0iPhrn88eepWTjth9pMXLTxU8",
  authDomain: "sahil-b52f6.firebaseapp.com",
  projectId: "new-sahil-b52f6-8b9c8",
  storageBucket: "sahil-b52f6.firebasestorage.app",
  messagingSenderId: "625101877373",
  appId: "1:625101877373:web:3bede9ec442259ad868114"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;
