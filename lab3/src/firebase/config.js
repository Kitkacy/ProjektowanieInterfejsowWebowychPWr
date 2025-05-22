import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDAaQWLf5z8Hw1gqv2GcNY63HJJcR8WVv0",
  authDomain: "piwowicka.firebaseapp.com",
  projectId: "piwowicka",
  storageBucket: "piwowicka.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };