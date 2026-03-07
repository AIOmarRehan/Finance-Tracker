import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import ReCAPTCHA from 'react-google-recaptcha';

function getGoogleAuthErrorMessage(error) {
  const code = error?.code;

  if (code === 'auth/unauthorized-domain') {
    return 'Google sign-in is not enabled for this domain. Add your Vercel domain in Firebase Auth Authorized domains.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Google sign-in is disabled in Firebase. Enable Google provider in Authentication > Sign-in method.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Popup was blocked by the browser. Allow popups and try again.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Google sign-in popup was closed before completing sign-in.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network error during Google sign-in. Please check your connection and try again.';
  }

  return `Failed to sign in with Google${code ? ` (${code})` : ''}.`;
}

export default function Login() {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const isRecaptchaConfigured = Boolean(recaptchaSiteKey);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const { login, signInWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const signupMessage = location.state?.signupSuccess ? location.state?.verificationMessage : null;

  async function handleSubmit(e) {
    e.preventDefault();

    // Only enforce reCAPTCHA if it's configured
    if (isRecaptchaConfigured && !captchaValue) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }

    try {
      setError('');
      setVerificationRequired(false);
      setShowResend(false);
      setLoading(true);
      await login(email, password);
      navigate('/app/dashboard');
    } catch (error) {
      // Check for email verification error
      if (error?.message === 'EMAIL_NOT_VERIFIED' || error?.message?.includes('EMAIL_NOT_VERIFIED')) {
        setVerificationRequired(true);
        setError('');
        setShowResend(true);
      } else if (error?.code === 'auth/too-many-requests') {
        setVerificationRequired(false);
        setError('Too many login attempts. Please wait a few minutes before trying again.');
      } else {
        setVerificationRequired(false);
        setError('Failed to login. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    try {
      setLoading(true);
      setError('');
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      // Sign out after sending verification email
      await signOut(auth);
      setShowResend(false);
      setVerificationRequired(true);
      alert('Verification email sent! Please check your inbox (including Spam/Junk folder).');
    } catch (error) {
      console.error(error);
      // Sign out just in case
      try { await signOut(auth); } catch (e) { /* ignore */ }
      
      if (error.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a few minutes before trying again.');
      } else {
        setError('Failed to resend verification email. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/app/dashboard');
    } catch (error) {
      setError(getGoogleAuthErrorMessage(error));
      console.error('Google sign-in failed:', error);
    } finally {
      setLoading(false);
    }
  }

  function onCaptchaChange(value) {
    setCaptchaValue(value);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 sm:space-y-8">
        {/* Back to Home Link */}
        <Link to="/" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <img 
              src="/favicon/favicon-128x128.png" 
              alt="Finance Tracker Logo" 
              className="h-16 w-16 sm:h-20 sm:w-20"
            />
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg" role="alert">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Verification Required Alert */}
        {verificationRequired && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg" role="alert">
            <p className="text-sm font-semibold">Email Verification Required</p>
            <p className="text-sm">You must verify your email first. Please check your email (including Spam/Junk), click the verification link, then try to log in again.</p>
            {showResend && (
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="mt-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline"
              >
                Resend Verification Email
              </button>
            )}
          </div>
        )}

        {/* Signup Success Alert */}
        {signupMessage && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 px-4 py-3 rounded-lg" role="alert">
            <p className="text-sm font-semibold">Account Created Successfully</p>
            <p className="text-sm">{signupMessage}</p>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-6 sm:mt-8 space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none transition-colors text-base"
                placeholder="you@example.com"
                aria-label="Email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none transition-colors text-base"
                placeholder="••••••••"
                aria-label="Password"
              />
            </div>

            {/* reCAPTCHA */}
            {isRecaptchaConfigured ? (
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={recaptchaSiteKey}
                  onChange={onCaptchaChange}
                />
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 px-3 py-2 rounded-lg text-sm">
                reCAPTCHA is not configured for this deployment.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-3 sm:py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 font-semibold py-3 sm:py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
