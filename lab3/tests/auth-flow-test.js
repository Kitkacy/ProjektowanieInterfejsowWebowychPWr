// Authentication Flows Test
// This script can help you test all authentication flows in the application

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
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

// Test Functions
// You can run these individually by calling them from the bottom of the script

// Test email/password signup
const testSignUp = async () => {
  try {
    const email = `test${Math.floor(Math.random() * 10000)}@example.com`;
    const password = "Test123!";
    
    console.log(`Testing signup with email: ${email}`);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", userCredential.user.uid);
    
    // Update profile
    await updateProfile(userCredential.user, {
      displayName: "Test User"
    });
    console.log("Profile updated with display name");
    
    // Email verification
    await sendEmailVerification(userCredential.user);
    console.log("Verification email sent");
    
    return { success: true, email, password, uid: userCredential.user.uid };
  } catch (error) {
    console.error("Error during signup:", error.message);
    return { success: false, error: error.message };
  }
};

// Test email/password login
const testLogin = async (email, password) => {
  try {
    console.log(`Testing login with email: ${email}`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user.uid);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error during login:", error.message);
    return { success: false, error: error.message };
  }
};

// Test password reset
const testPasswordReset = async (email) => {
  try {
    console.log(`Testing password reset for: ${email}`);
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent");
    return { success: true };
  } catch (error) {
    console.error("Error during password reset:", error.message);
    return { success: false, error: error.message };
  }
};

// Test Google sign-in
const testGoogleSignIn = async () => {
  try {
    console.log("Testing Google sign-in");
    const provider = new GoogleAuthProvider();
    // Add scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign-in successful");
    console.log("User:", {
      uid: result.user.uid,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL
    });
    
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error during Google sign-in:", error.message);
    return { success: false, error: error.message };
  }
};

// Test sign out
const testSignOut = async () => {
  try {
    console.log("Testing sign out");
    await signOut(auth);
    console.log("Sign out successful");
    return { success: true };
  } catch (error) {
    console.error("Error during sign out:", error.message);
    return { success: false, error: error.message };
  }
};

// Run all tests in sequence
const runAllTests = async () => {
  console.log("=== STARTING AUTHENTICATION TESTS ===");
  
  // 1. Create a new user
  console.log("\n=== TEST: User Signup ===");
  const signupResult = await testSignUp();
  if (!signupResult.success) {
    console.error("Signup test failed. Stopping tests.");
    return;
  }
  
  // 2. Sign out
  console.log("\n=== TEST: Sign Out ===");
  const signOutResult = await testSignOut();
  if (!signOutResult.success) {
    console.error("Sign out test failed. Continuing anyway.");
  }
  
  // 3. Log in with the new user
  console.log("\n=== TEST: Email/Password Login ===");
  const loginResult = await testLogin(signupResult.email, signupResult.password);
  if (!loginResult.success) {
    console.error("Login test failed. Stopping tests.");
    return;
  }
  
  // 4. Sign out again
  console.log("\n=== TEST: Second Sign Out ===");
  await testSignOut();
  
  // 5. Test password reset
  console.log("\n=== TEST: Password Reset ===");
  await testPasswordReset(signupResult.email);
  
  // 6. Google sign-in
  console.log("\n=== TEST: Google Sign-in ===");
  console.log("Note: This will open a popup window. Please complete the Google login process.");
  const googleResult = await testGoogleSignIn();
  
  // 7. Final sign out
  console.log("\n=== TEST: Final Sign Out ===");
  await testSignOut();
  
  console.log("\n=== ALL TESTS COMPLETED ===");
  
  // Print summary
  console.log("\n=== TEST SUMMARY ===");
  console.log("Signup:", signupResult.success ? "SUCCESS" : "FAILED");
  console.log("Login:", loginResult.success ? "SUCCESS" : "FAILED");
  console.log("Google Sign-in:", googleResult.success ? "SUCCESS" : "FAILED");
};

// Auth state monitor
const startAuthMonitor = () => {
  console.log("Starting authentication state monitor...");
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("AUTH STATE CHANGED: User logged in");
      console.log("User details:", {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL
      });
    } else {
      console.log("AUTH STATE CHANGED: User logged out");
    }
  });
};

// Start the auth monitor
const unsubscribe = startAuthMonitor();

// Run all tests
// Comment this out and call individual test functions if you want to test specific flows
runAllTests().finally(() => {
  // Stop the auth monitor after 1 minute
  setTimeout(() => {
    unsubscribe();
    console.log("Authentication state monitor stopped");
  }, 60000);
});
