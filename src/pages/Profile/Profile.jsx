import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { currentUser, updateUserProfile, updateUserEmail, updateUserPassword, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Check if user is Google-only (no password provider linked)
  const isGoogleUser = currentUser?.providerData?.some(p => p.providerId === 'google.com') &&
    !currentUser?.providerData?.some(p => p.providerId === 'password');

  // Profile form
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || ''
  });

  // Email form
  const [emailData, setEmailData] = useState({
    email: currentUser?.email || '',
    password: ''
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Delete account form
  const [deleteData, setDeleteData] = useState({
    email: '',
    password: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await updateUserProfile(profileData.displayName);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateEmail(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Validate email is different
      if (emailData.email === currentUser?.email) {
        setMessage({ type: 'error', text: 'New email must be different from current email' });
        setLoading(false);
        return;
      }

      // For Google-only users, require a password to link email/password provider
      if (isGoogleUser && (!emailData.password || emailData.password.length < 6)) {
        setMessage({ type: 'error', text: 'Please set a password (at least 6 characters) for your new email sign-in' });
        setLoading(false);
        return;
      }
      
      await updateUserEmail(emailData.email, isGoogleUser ? emailData.password : undefined);
      setMessage({ type: 'success', text: 'A verification email has been sent to your new address. Please verify it to complete the change.' });
      setEmailData({ email: currentUser?.email || '', password: '' });
    } catch (error) {
      console.error('Email update error:', error);
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ type: 'error', text: 'Please log out and log in again to change your email' });
      } else if (error.code === 'auth/email-already-in-use') {
        setMessage({ type: 'error', text: 'This email is already in use by another account' });
      } else if (error.code === 'auth/invalid-email') {
        setMessage({ type: 'error', text: 'Invalid email address' });
      } else if (error.code === 'auth/operation-not-allowed') {
        setMessage({ type: 'error', text: 'Email change is not allowed. Please log out and log in again, then try.' });
      } else if (error.message && error.message.includes('too-many-requests')) {
        setMessage({ type: 'error', text: 'Too many requests. Please try again later.' });
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to update email' });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match' });
    }

    if (passwordData.newPassword.length < 6) {
      return setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await updateUserPassword(passwordData.newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ type: 'error', text: 'Please log out and log in again to change your password' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update password' });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount(e) {
    e.preventDefault();
    
    if (deleteData.email !== currentUser?.email) {
      return setMessage({ type: 'error', text: 'Email does not match your account email' });
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await deleteAccount(deleteData.email, deleteData.password);
      // User will be automatically logged out after account deletion
      navigate('/');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Incorrect password' });
      } else if (error.code === 'auth/invalid-credential') {
        setMessage({ type: 'error', text: 'Invalid credentials. Please check your password.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete account: ' + error.message });
      }
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <div className="w-full max-w-4xl overflow-hidden">
      {/* Home Link */}
      <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex">
            {['profile', 'email', 'password', 'delete'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMessage({ type: '', text: '' });
                }}
                className={`flex-1 pb-3 pt-1 border-b-2 font-medium text-xs sm:text-sm transition-colors text-center ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                } ${tab === 'delete' ? (activeTab === tab ? '' : 'text-red-600 dark:text-red-400') : ''}`}
              >
                {tab === 'delete' ? (<span className="hidden sm:inline">Delete Account</span>) : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'delete' && <span className="sm:hidden">Delete</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4">

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={profileData.displayName}
                onChange={(e) => setProfileData({ displayName: e.target.value })}
                className="input-field"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email (Read-only)
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="input-field bg-gray-50 dark:bg-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                To change your email, use the Email tab
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        )}

        {/* Email Tab */}
        {activeTab === 'email' && (
          <form onSubmit={handleUpdateEmail} className="space-y-4 sm:space-y-6">
            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Details</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Email</p>
                  <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 break-all">{currentUser?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full sm:w-auto bg-red-500 text-white px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg hover:bg-red-600 whitespace-nowrap text-sm"
                >
                  Logout
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Email
              </label>
              <input
                type="email"
                id="newEmail"
                required
                value={emailData.email}
                onChange={(e) => setEmailData({ email: e.target.value })}
                className="input-field"
                placeholder="new@example.com"
              />
            </div>

            {isGoogleUser && (
              <div>
                <label htmlFor="newEmailPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Set a Password for New Email
                </label>
                <input
                  type="password"
                  id="newEmailPassword"
                  required
                  value={emailData.password}
                  onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                  className="input-field"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This password will be used to sign in with your new email address
                </p>
              </div>
            )}

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                A verification email will be sent to your new address. Your email will only change after you verify the new address.
              </p>
            </div>

            {currentUser?.providerData?.some(p => p.providerId === 'google.com') && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  If your account was created using Google Sign-In and you change your email address, you can still sign in using your Google account as usual.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Email'}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handleUpdatePassword} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                You may need to log in again after changing your password
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {/* Delete Account Tab */}
        {activeTab === 'delete' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 dark:text-red-400">
                Deleting your account is permanent and cannot be undone. All your data including transactions, categories, and goals will be permanently deleted.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              Delete My Account
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Account Deletion</h2>
            
            <form onSubmit={handleDeleteAccount} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="deleteEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="deleteEmail"
                  required
                  value={deleteData.email}
                  onChange={(e) => setDeleteData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                  placeholder={currentUser?.email}
                />
              </div>

              <div>
                <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="deletePassword"
                  required
                  value={deleteData.password}
                  onChange={(e) => setDeleteData(prev => ({ ...prev, password: e.target.value }))}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <p className="text-sm text-red-800 dark:text-red-300 font-semibold">
                  This action cannot be undone!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteData({ email: '', password: '' });
                  }}
                  className="order-2 sm:order-1 flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="order-1 sm:order-2 flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
