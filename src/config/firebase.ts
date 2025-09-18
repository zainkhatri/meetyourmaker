import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB3DDOHH9tqjxP7_omG0R5an929riU22ZY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "meetyourmaker-zain.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "meetyourmaker-zain",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "meetyourmaker-zain.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "557837382932",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:557837382932:web:c032a0c69bc928f6133e01",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MLZJF1NLSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics only if supported
export const analytics = await isSupported()
  .then(() => getAnalytics(app))
  .catch(() => null);

// Export the app instance in case we need it elsewhere
export default app;