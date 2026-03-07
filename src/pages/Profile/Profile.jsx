import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { currentUser, updateUserProfile, updateUserEmail, updateUserPassword, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || ''
  });

  // Email form
  const [emailData, setEmailData] = useState({
    email: currentUser?.email || ''
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

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
      
      await updateUserEmail(emailData.email);
      setMessage({ type: 'success', text: 'Email updated successfully!' });
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        setMessage({ type: 'error', text: 'Please log out and log in again to change your email' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update email' });
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

  return (
    <div className="max-w-4xl">
      {/* Home Link */}
      <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['profile', 'email', 'password'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMessage({ type: '', text: '' });
                }}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
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
          <form onSubmit={handleUpdateEmail} className="space-y-6">
            <div className="mt-6 max-h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Details</h3>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-800 dark:text-gray-200">{currentUser?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 whitespace-nowrap"
                  >
                    Logout
                  </button>
                </div>
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

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                You may need to log in again after changing your email
              </p>
            </div>

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
          <form onSubmit={handleUpdatePassword} className="space-y-6">
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
        </div>
      </div>
    </div>
  );
}
