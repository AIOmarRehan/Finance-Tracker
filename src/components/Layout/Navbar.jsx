import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import DarkModeToggle from '../Common/DarkModeToggle';

export default function Navbar({ onMenuClick }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in the dashboard area (/app/*)
  const isInDashboard = location.pathname.startsWith('/app');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to Home page after logout
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/30 fixed w-full top-0 z-50 border-b border-transparent dark:border-gray-700" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Menu Button */}
          <div className="flex items-center">
            {/* Hamburger menu - only show in dashboard */}
            {isInDashboard && (
              <button
                onClick={onMenuClick}
                className="md:hidden mr-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/web-icon/svgviewer-output.svg" alt="SpendMetra" className="h-20 w-20" />
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white hidden sm:inline">SpendMetra</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <DarkModeToggle />
            {currentUser ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                  {currentUser?.displayName || currentUser?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="hidden sm:block bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 font-semibold px-4 py-2 rounded-lg transition-colors text-sm ml-4"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
