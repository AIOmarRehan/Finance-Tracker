import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">SpendMetra</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">Managing your finances made simple and secure.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <p className="text-sm text-gray-400 dark:text-gray-500">Have questions? We'd love to hear from you.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              <a href="mailto:ai.omar.rehan@gmail.com" className="text-primary-400 dark:text-primary-500 hover:text-primary-300 dark:hover:text-primary-400">
                ai.omar.rehan@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 dark:border-gray-900 pt-6 sm:pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>&copy; 2026 SpendMetra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;