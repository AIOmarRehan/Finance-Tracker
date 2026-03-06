import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  updatePassword,
  updateEmail,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  function signup(email, password, displayName) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        if (displayName) {
          await updateProfile(userCredential.user, { displayName });
        }
        // Send email verification
        await sendEmailVerification(userCredential.user);
        return userCredential;
      });
  }

  // Login with email and password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          // Sign out immediately so unverified users cannot pass route guards
          await signOut(auth);
          throw new Error('EMAIL_NOT_VERIFIED');
        }
        return userCredential;
      });
  }

  // Resend email verification
  function resendVerificationEmail() {
    if (currentUser) {
      return sendEmailVerification(currentUser);
    }
    return Promise.reject(new Error('No user logged in'));
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // Google sign in
  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  // Update user profile
  function updateUserProfile(displayName) {
    return updateProfile(currentUser, { displayName });
  }

  // Update user email
  function updateUserEmail(email) {
    return updateEmail(currentUser, email);
  }

  // Update user password
  function updateUserPassword(password) {
    return updatePassword(currentUser, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Don't set currentUser for unverified email/password users
      // This prevents PublicRoute from redirecting before verification alert shows
      if (user && !user.emailVerified && user.providerData.some(p => p.providerId === 'password')) {
        setCurrentUser(null);
      } else {
        setCurrentUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
