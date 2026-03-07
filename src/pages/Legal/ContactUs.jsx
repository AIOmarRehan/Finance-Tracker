import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
  const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setWarning(null);

      let emailNotificationStatus = 'not_attempted';
      let emailNotificationError = null;
      let emailNotificationSentAt = null;

      // Send email using EmailJS
      try {
        if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
          throw new Error('EmailJS env vars are missing');
        }

        await emailjs.send(
          emailJsServiceId,
          emailJsTemplateId,
          {
            to_email: 'ai.omar.rehan@gmail.com',
            recipient_email: 'ai.omar.rehan@gmail.com',
            from_name: formData.name,
            from_email: formData.email,
            reply_to: formData.email,
            subject: formData.subject,
            message: formData.message,
            name: formData.name,
            email: formData.email,
            user_email: formData.email,
            title: formData.subject,
            user_subject: formData.subject,
            user_message: formData.message,
          },
          emailJsPublicKey
        );
        emailNotificationStatus = 'sent';
        emailNotificationSentAt = serverTimestamp();
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        emailNotificationStatus = 'failed';
        emailNotificationError = emailError?.text || emailError?.message || `EmailJS error (status: ${emailError?.status || 'unknown'})`;

        // Continue even if email fails - message is still saved to Firestore
        setWarning(`Your message was saved, but email notification failed: ${emailNotificationError}`);
      }

      // Save message to Firestore (single write; allowed by current rules)
      await addDoc(collection(db, 'contactMessages'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
        status: 'new',
        emailNotificationStatus,
        emailNotificationError,
        emailNotificationSentAt
      });

      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          {/* Home Link */}
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold mb-6 text-sm sm:text-base">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Get in Touch</h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              Have questions, feedback, or need assistance? We'd love to hear from you. Please feel free to contact us using the form below or reach out directly via email.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
            {/* Direct Contact */}
            <div className="text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="mb-4">
                <svg className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Send us an email and we'll respond as soon as possible</p>
              <a href="mailto:ai.omar.rehan@gmail.com" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm">
                ai.omar.rehan@gmail.com
              </a>
            </div>

            {/* Response Time */}
            <div className="text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="mb-4">
                <svg className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">We typically respond to inquiries within 24-48 hours during business days</p>
            </div>

            {/* Support */}
            <div className="text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="mb-4">
                <img src="/icons/support.svg" alt="Support" className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Support Topics</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Account issues, feature requests, feedback, and general inquiries</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Send us a Message</h2>

            {submitted && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 px-4 py-3 rounded-lg mb-6" role="alert">
                <p className="font-semibold">Thank you for your message!</p>
                <p>We've received your inquiry and will get back to you soon.</p>
              </div>
            )}

            {warning && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400 px-4 py-3 rounded-lg mb-6" role="alert">
                <p className="font-semibold">Notification Warning</p>
                <p>{warning}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-6" role="alert">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-base"
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-base"
                  placeholder="john@example.com"
                  required
                  disabled={loading}
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none text-base"
                  placeholder="How can we help?"
                  required
                  disabled={loading}
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none resize-none text-base"
                  placeholder="Please describe your inquiry or feedback..."
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 dark:bg-primary-500 text-white font-semibold py-3 sm:py-3.5 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-10 sm:mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-blue-400 mb-2">Privacy Notice</h3>
            <p className="text-blue-800 dark:text-blue-300 text-sm sm:text-base">
              Your information will be treated according to our <a href="/privacy-policy" className="font-semibold hover:underline">Privacy Policy</a>. We take your privacy seriously and will only use the information you provide to respond to your inquiry.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
