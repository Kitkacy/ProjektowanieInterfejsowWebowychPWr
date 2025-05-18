// Konfiguracja Firebase (uzupełnij swoimi danymi z konsoli Firebase)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbgzb-r7dhjgM5jWw5Mi5d1lYkHeVpiTc",
  authDomain: "hosting4pwr.firebaseapp.com",
  projectId: "hosting4pwr",
  storageBucket: "hosting4pwr.firebasestorage.app",
  messagingSenderId: "188185362158",
  appId: "1:188185362158:web:e2178ae3c728fdd6b4bdff",
  measurementId: "G-80MEBM2MVY"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
