import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to Home page after logout
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Menu Button */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden mr-2 p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/web-icon/svgviewer-output.svg" alt="SpendMetra" className="h-20 w-20" />
              <span className="ml-2 text-xl font-bold text-gray-800">SpendMetra</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  {currentUser?.displayName || currentUser?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-secondary ml-4"
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
