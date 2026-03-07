import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserByEmail } from '../../utils/firestore';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      // Step 1: Check if email exists in the database
      const userRecord = await getUserByEmail(email);

      if (!userRecord) {
        // Email does not exist in the system
        setMessage({
          type: 'error',
          text: 'No account is associated with this email address.'
        });
        return;
      }

      // Step 2: Check the authentication provider
      if (userRecord.provider === 'google.com') {
        // Google OAuth account
        setMessage({
          type: 'success',
          text: 'This account was created using Google Sign-In. Please sign in directly using your Google account.'
        });
        setEmail('');
        return;
      }

      // Step 3: Standard email/password account - send reset link
      await resetPassword(email);
      setMessage({
        type: 'success',
        text: 'A password reset link has been sent to your email address.'
      });
      setEmail('');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/invalid-email') {
        setMessage({ type: 'error', text: 'Invalid email address.' });
      } else if (error.code === 'auth/too-many-requests') {
        setMessage({ type: 'error', text: 'Too many attempts. Please wait a few minutes and try again.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to send reset email. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img src="/favicon/favicon-512x512.png" alt="SpendMetra" className="h-24 w-24 mb-4" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`rounded-lg p-4 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="flex items-center justify-center space-x-2 text-sm">
            <Link 
              to="/login" 
              className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
            >
              Back to Login
            </Link>
            <span className="text-gray-500 dark:text-gray-400">•</span>
            <Link 
              to="/signup" 
              className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
