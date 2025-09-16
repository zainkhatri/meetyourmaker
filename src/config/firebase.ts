import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyB3DDOHH9tqjxP7_omG0R5an929riU22ZY",
  authDomain: "meetyourmaker-zain.firebaseapp.com",
  projectId: "meetyourmaker-zain",
  storageBucket: "meetyourmaker-zain.firebasestorage.app",
  messagingSenderId: "557837382932",
  appId: "1:557837382932:web:c032a0c69bc928f6133e01",
  measurementId: "G-MLZJF1NLSE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
