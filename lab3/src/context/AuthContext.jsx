import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile, getUserProfile, updateUserProfile } from '../firebase/firestoreService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component that wraps the app and provides auth context
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear any previous errors
  const clearError = () => setError(null);

  // Sign in with email and password
  const login = async (email, password) => {
    clearError();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Create a new user with email and password
  const signup = async (email, password, displayName = '') => {
    clearError();
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set display name if provided
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Create a user profile in Firestore
      await createUserProfile(user.uid, {
        email: user.email,
        displayName: displayName || user.email.split('@')[0],
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified
      });
      
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    clearError();
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Google using popup
  const loginWithGoogle = async () => {
    clearError();
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes for additional profile information if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if the user profile already exists
      const userProfile = await getUserProfile(user.uid);
      
      if (!userProfile) {
        // Create a new profile if it doesn't exist
        await createUserProfile(user.uid, {
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || '',
          emailVerified: user.emailVerified,
          provider: 'google'
        });
      } else {
        // Update the profile with latest info
        await updateUserProfile(user.uid, {
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          lastLogin: new Date()
        });
      }
      
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Google using redirect (better for mobile)
  const loginWithGoogleRedirect = async () => {
    clearError();
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes for additional profile information if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      await signInWithRedirect(auth, provider);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Handle redirect result
  const handleRedirectResult = async () => {
    clearError();
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const user = result.user;
        
        // Check if the user profile already exists
        const userProfile = await getUserProfile(user.uid);
        
        if (!userProfile) {
          // Create a new profile if it doesn't exist
          await createUserProfile(user.uid, {
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified,
            provider: 'google'
          });
        } else {
          // Update the profile with latest info
          await updateUserProfile(user.uid, {
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            lastLogin: new Date()
          });
        }
        
        return user;
      }
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Check for redirect result on component mount
  useEffect(() => {
    handleRedirectResult().catch((err) => {
      console.error("Error handling redirect:", err);
    });
  }, []);

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    loginWithGoogle,
    loginWithGoogleRedirect,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
