import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const TermsOfService = () => {
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

          <h1 className="text-4xl font-bold mb-8 text-gray-900">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">

            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using SpendMetra, you agree to comply with these Terms of Service.
                If you do not agree with any part of these terms, you may not use the application.
                These terms apply to all users and visitors of the SpendMetra platform.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Description of Service</h2>

              <p className="text-gray-700 mb-4">
                SpendMetra is a web application that helps users track income, manage expenses,
                and analyze their financial activity through an organized dashboard.
              </p>

              <p className="text-gray-700 mb-4">
                The platform allows users to securely store and manage financial records.
                All financial data stored within SpendMetra is protected using modern
                encryption technologies and secure cloud infrastructure to help ensure
                the privacy and safety of user information.
              </p>

              <p className="text-gray-700 mb-4">
                The service provides tools to:
              </p>

              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Record and categorize transactions</li>
                <li>Track income and expenses</li>
                <li>View financial reports and analytics</li>
                <li>Set and monitor financial goals</li>
                <li>Organize financial data by categories and dates</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">As a user of SpendMetra, you agree to:</p>

              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide accurate and complete account information</li>
                <li>Maintain the confidentiality of your login credentials</li>
                <li>Use the platform responsibly and in accordance with these terms</li>
                <li>Notify us immediately of any unauthorized access to your account</li>
                <li>Be responsible for all activity on your account</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">You are prohibited from:</p>

              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Attempting to hack, disrupt, or damage the SpendMetra system</li>
                <li>Uploading malicious or harmful content</li>
                <li>Using the platform for illegal activities</li>
                <li>Harassing, threatening, or abusing other users</li>
                <li>Violating intellectual property rights</li>
                <li>Attempting to gain unauthorized access to other accounts</li>
                <li>Reverse engineering or attempting to circumvent security measures</li>
                <li>Using the platform in any way that violates applicable laws</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Limitation of Liability</h2>

              <p className="text-gray-700 mb-4">
                SpendMetra is provided on an "as-is" basis without warranties of any kind,
                either express or implied. We do not guarantee that:
              </p>

              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>The service will be uninterrupted or error-free</li>
                <li>All defects will be corrected</li>
                <li>The service will meet your specific requirements</li>
              </ul>

              <p className="text-gray-700 mt-4">
                To the maximum extent permitted by law, SpendMetra shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages
                resulting from your use of or inability to use the service.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Account Termination</h2>

              <p className="text-gray-700 mb-4">
                SpendMetra reserves the right to suspend or terminate your account if:
              </p>

              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>You violate these Terms of Service</li>
                <li>You engage in prohibited activities</li>
                <li>You provide false or misleading information</li>
                <li>Your account is suspected of fraudulent activity</li>
              </ul>

              <p className="text-gray-700 mt-4">
                Upon termination, your access to the platform will be revoked and your data
                may be deleted according to our data retention policies.
              </p>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Changes to Terms</h2>

              <p className="text-gray-700 mb-4">
                SpendMetra reserves the right to update or modify these Terms of Service
                at any time. Changes will be effective immediately upon posting to the platform.
                Your continued use of the service constitutes your acceptance of the updated terms.
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Intellectual Property</h2>

              <p className="text-gray-700 mb-4">
                All content, features, and functionality of SpendMetra (including but not limited
                to software, design, and text) are owned by SpendMetra and are protected by
                international copyright and intellectual property laws.
              </p>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Governing Law</h2>

              <p className="text-gray-700 mb-4">
                These Terms of Service are governed by applicable international laws and
                regulations related to digital services and data protection.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Contact Us</h2>

              <p className="text-gray-700 mb-4">
                If you have questions or concerns regarding these Terms of Service,
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

export default TermsOfService;