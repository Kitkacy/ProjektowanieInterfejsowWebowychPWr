// Simple auth test file
// Run this file manually to test the auth functionality
// This is not an actual test but a helper script to test the auth flow

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnDEoCI0JUEU1h8U83VeM4MAGam1lrWmM",
  authDomain: "piwowicka.firebaseapp.com",
  projectId: "piwowicka",
  storageBucket: "piwowicka.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Test email/password authentication
async function testEmailAuth() {
  try {
    console.log("Testing email/password authentication...");
    
    // Signup test
    const email = "test@books4cash.io";
    const password = "test123";
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", userCredential.user);
    
    // Signout test
    await signOut(auth);
    console.log("User signed out");
    
    // Login test
    const loginCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", loginCredential.user);
    
    await signOut(auth);
    console.log("User signed out again");
    
    return "Email authentication tests passed";
  } catch (error) {
    console.error("Email authentication test failed:", error);
    return "Email authentication test failed: " + error.message;
  }
}

// Test Google authentication
async function testGoogleAuth() {
  try {
    console.log("Testing Google authentication...");
    
    const provider = new GoogleAuthProvider();
    
    // This will open a popup window for Google authentication
    const result = await signInWithPopup(auth, provider);
    console.log("Google user:", result.user);
    
    // Check for authentication token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    console.log("Google access token:", token);
    
    await signOut(auth);
    console.log("Google user signed out");
    
    return "Google authentication test passed";
  } catch (error) {
    console.error("Google authentication test failed:", error);
    return "Google authentication test failed: " + error.message;
  }
}

// Monitor auth state
function monitorAuthState() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "User logged out");
      if (user) {
        console.log("User details:", {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      }
    });
    
    // Resolve after 10 seconds of monitoring
    setTimeout(() => {
      unsubscribe();
      resolve("Auth state monitoring completed");
    }, 10000);
  });
}

// Run tests
async function runTests() {
  // Start monitoring auth state
  const monitorPromise = monitorAuthState();
  
  // Test email authentication
  const emailResult = await testEmailAuth();
  console.log(emailResult);
  
  // Test Google authentication
  const googleResult = await testGoogleAuth();
  console.log(googleResult);
  
  // Wait for monitoring to complete
  await monitorPromise;
  
  console.log("All tests completed");
}

runTests();
