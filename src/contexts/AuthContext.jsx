import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
  updatePassword,
  updateEmail,
  sendEmailVerification,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { deleteAllUserData } from '../utils/firestore';

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
        // Reload user to get fresh emailVerified status
        await userCredential.user.reload();
        
        // Check if email is verified (using fresh data)
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
    provider.setCustomParameters({ prompt: 'select_account' });

    return signInWithPopup(auth, provider).catch((error) => {
      // Fallback to redirect flow when popup is blocked by browser settings.
      if (error?.code === 'auth/popup-blocked') {
        return signInWithRedirect(auth, provider);
      }
      throw error;
    });
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

  // Send password reset email
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Delete account with reauthentication
  async function deleteAccount(email, password) {
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    // Reauthenticate user before deletion
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(currentUser, credential);

    // Delete all user data from Firestore
    await deleteAllUserData(currentUser.uid);

    // Delete the user account
    await deleteUser(currentUser);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Reload user to get fresh emailVerified status
        await user.reload();
        
        // Don't set currentUser for unverified email/password users
        // This prevents PublicRoute from redirecting before verification alert shows
        if (!user.emailVerified && user.providerData.some(p => p.providerId === 'password')) {
          setCurrentUser(null);
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
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
    resendVerificationEmail,
    resetPassword,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
