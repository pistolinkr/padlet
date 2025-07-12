import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "padlet-clone.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "padlet-clone",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "padlet-clone.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Auth, Firestore 및 Storage 인스턴스
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 