import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const { currentUser } = useAuth();

  // Redirect logged-in users to the dashboard
  if (currentUser) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Welcome to Finance Tracker</h2>
          <p className="text-lg text-gray-700 mb-6">Track your expenses, set goals, and manage your finances effectively.</p>
          <div>
            <Link to="/signup" className="btn-primary mr-4">Get Started</Link>
            <Link to="/login" className="btn-secondary">Log In</Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;