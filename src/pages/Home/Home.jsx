import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();

  // Redirect logged-in users to the dashboard
  if (currentUser) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white py-16 sm:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">Take Control of Your Money</h1>
            <p className="text-lg sm:text-xl text-primary-100 dark:text-primary-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
              SpendMetra helps you monitor your expenses, track income, and understand your spending habits through a simple and organized dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg">
                Get Started
              </Link>
              <Link to="/login" className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg">
                Log In
              </Link>
            </div>
          </div>
        </section>

        {/*  Features Section  */}
        <section className="features-section py-12 sm:py-16 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-gray-900 dark:text-white">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="feature-card bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="feature-icon mb-4">
                  <svg className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Track Expenses</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Easily record and categorize your daily expenses to understand where your money goes.</p>
              </div>

              {/* Feature 2 */}
              <div className="feature-card bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="feature-icon mb-4">
                  <img src="/icons/monitor-income.svg" alt="Monitor Income" className="h-10 w-10 sm:h-12 sm:w-12" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Monitor Income</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Keep track of different income sources and manage multiple revenue streams.</p>
              </div>

              {/* Feature 3 */}
              <div className="feature-card bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="feature-icon mb-4">
                  <svg className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Visual Reports</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Charts and summaries help you understand your spending patterns and financial habits.</p>
              </div>

              {/* Feature 4 */}
              <div className="feature-card bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="feature-icon mb-4">
                  <svg className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Smart Organization</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Transactions organized by categories and dates for easy tracking and management.</p>
              </div>
            </div>
          </div>
        </section>

        {/*  How It Works Section  */}
        <section className="how-it-works py-12 sm:py-16 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-gray-900 dark:text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="step-circle mb-4 bg-primary-600 dark:bg-primary-500 rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Create an Account</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Sign up in minutes to start managing your finances securely.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="step-circle mb-4 bg-primary-600 dark:bg-primary-500 rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Add Transactions</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Record your income and expenses with detailed categories and notes.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="step-circle mb-4 bg-primary-600 dark:bg-primary-500 rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Analyze Spending</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">View insights and comprehensive financial summaries in your dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/*  Benefits Section  */}
        <section className="benefits-section py-12 sm:py-16 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 sm:mb-12 text-gray-900 dark:text-white">Why Choose SpendMetra?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="benefit-item flex items-start bg-white dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
                <div className="benefit-check mr-3 sm:mr-4 flex-shrink-0 mt-0.5">
                  <svg className="h-6 w-6 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Simple & Intuitive</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">User-friendly interface designed for everyone, from beginners to finance enthusiasts.</p>
                </div>
              </div>

              <div className="benefit-item flex items-start bg-white dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
                <div className="benefit-check mr-3 sm:mr-4 flex-shrink-0 mt-0.5">
                  <svg className="h-6 w-6 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Secure & Private</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Your financial data is protected with industry-standard security and encryption.</p>
                </div>
              </div>

              <div className="benefit-item flex items-start bg-white dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
                <div className="benefit-check mr-3 sm:mr-4 flex-shrink-0 mt-0.5">
                  <svg className="h-6 w-6 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Clear Insights</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Get detailed financial insights and reports to make better financial decisions.</p>
                </div>
              </div>

              <div className="benefit-item flex items-start bg-white dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
                <div className="benefit-check mr-3 sm:mr-4 flex-shrink-0 mt-0.5">
                  <svg className="h-6 w-6 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Multi-Device Access</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Access your finances anytime, anywhere from any device with secure login.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="cta-section bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white py-12 sm:py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Take Control?</h2>
            <p className="text-lg sm:text-xl text-primary-100 dark:text-primary-200 mb-6 sm:mb-8">
              Start managing your finances today. It's free and takes less than a minute to create an account.
            </p>
            <Link to="/signup" className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg">
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;