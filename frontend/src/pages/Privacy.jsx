import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="text-gray-700 mb-6">
          We respect your privacy and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and
          safeguard your information when you visit our website.
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Information We Collect
        </h2>

        <p className="text-gray-700 mb-4">
          We may collect personal information such as your name, email address,
          phone number, and payment details when you donate, register, or
          contact us.
        </p>

        {/* Section 2 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          How We Use Your Information
        </h2>

        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>To process donations and transactions</li>
          <li>To communicate updates about our programs</li>
          <li>To improve our website and services</li>
          <li>To respond to inquiries and support requests</li>
        </ul>

        {/* Section 3 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Sharing Your Information
        </h2>

        <p className="text-gray-700 mb-4">
          We do not sell or rent your personal information. We may share
          information only with trusted partners such as payment processors to
          complete transactions.
        </p>

        {/* Section 4 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Data Security
        </h2>

        <p className="text-gray-700 mb-4">
          We implement appropriate security measures to protect your personal
          information from unauthorized access or disclosure.
        </p>

        {/* Section 5 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Your Rights
        </h2>

        <p className="text-gray-700 mb-4">
          You have the right to request access, correction, or deletion of your
          personal information by contacting us.
        </p>

        {/* Section 6 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Contact Us
        </h2>

        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>

        <p className="text-gray-700 mt-2">
          Email: support@example.com
        </p>

      </div>
    </div>
  );
}