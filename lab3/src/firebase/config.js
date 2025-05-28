import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAnDEoCI0JUEU1h8U83VeM4MAGam1lrWmM",
  authDomain: "piwowicka.firebaseapp.com",
  projectId: "piwowicka",
  storageBucket: "piwowicka.appspot.com",
  messagingSenderId: "107466546327",
  appId: "1:107466546327:web:44acc54154b0ed3f729dd2",
  measurementId: "G-NCJYP50F7F"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };