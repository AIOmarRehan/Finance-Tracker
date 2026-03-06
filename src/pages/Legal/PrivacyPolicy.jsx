import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Home Link */}
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">

            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                SpendMetra is committed to protecting your privacy and securing your financial data.
                This Privacy Policy explains how we collect, use, store, and protect your information
                when you use the SpendMetra financial tracking platform.
              </p>

              <p className="text-gray-700">
                Your financial information is extremely sensitive, and we apply strong encryption
                and security practices to ensure that your data remains private and protected.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                SpendMetra collects certain information to provide and improve the application.
              </p>

              <h3 className="text-xl font-semibold mb-2 text-gray-800">Account Information</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Email address</li>
                <li>Password (securely managed through Firebase Authentication)</li>
                <li>Basic profile information</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-800">Financial Data</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Income and expense transactions</li>
                <li>Expense categories</li>
                <li>Financial goals and targets</li>
                <li>Budget and savings information</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 text-gray-800">Usage Data</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Device type and operating system</li>
                <li>Browser information</li>
                <li>IP address</li>
                <li>Application interaction data</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use collected information only to operate and improve the SpendMetra platform.
              </p>

              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide financial tracking features and dashboards</li>
                <li>Generate reports and insights</li>
                <li>Improve system performance and user experience</li>
                <li>Maintain security and detect suspicious activity</li>
                <li>Respond to support requests</li>
                <li>Send important service notifications</li>
              </ul>

              <p className="text-gray-700">
                SpendMetra does <strong>not sell, rent, or trade your financial data</strong> to any third party.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Data Encryption and Security</h2>

              <p className="text-gray-700 mb-4">
                SpendMetra uses strong industry-standard encryption to protect all financial data.
              </p>

              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Encryption in Transit:</strong> All communication between your device and our servers is protected using HTTPS and TLS encryption.</li>
                <li><strong>Encryption at Rest:</strong> All stored financial data is encrypted within secure databases.</li>
                <li><strong>Secure Authentication:</strong> User authentication is handled through secure identity systems.</li>
                <li><strong>Restricted Data Access:</strong> Only authorized systems can process encrypted financial information.</li>
                <li><strong>Continuous Security Monitoring:</strong> Our systems are monitored to detect and prevent security threats.</li>
              </ul>

              <p className="text-gray-700">
                While we apply strong security practices, no online service can guarantee absolute security.
                However, we continuously improve our systems to maintain the highest protection standards.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Third-Party Services</h2>

              <p className="text-gray-700 mb-4">
                SpendMetra may rely on trusted infrastructure providers to support the platform.
              </p>

              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Cloud hosting services (Firebase)</li>
                <li>Authentication services</li>
                <li>System analytics and performance monitoring</li>
              </ul>

              <p className="text-gray-700">
                These providers follow strict security and privacy standards and are only used
                to operate the application infrastructure.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Data Ownership and User Rights</h2>

              <p className="text-gray-700 mb-4">
                You fully own your financial data within SpendMetra.
              </p>

              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated financial data</li>
                <li>Request clarification about how your data is used</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Changes to This Policy</h2>

              <p className="text-gray-700">
                We may update this Privacy Policy to reflect improvements in our services,
                security practices, or legal requirements. Updates will be published on this page
                with a revised update date.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Contact Us</h2>

              <p className="text-gray-700 mb-4">
                If you have any questions or concerns about this Privacy Policy or your data,
                please contact us:
              </p>

              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:ai.omar.rehan@gmail.com" className="text-primary-600 hover:text-primary-700">
                    ai.omar.rehan@gmail.com
                  </a>
                </p>
              </div>
            </section>

            <div className="border-t pt-8 mt-8">
              <p className="text-sm text-gray-500">
                Last updated: March 2026
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;