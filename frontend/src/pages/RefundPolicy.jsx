import React from "react";

export default function RefundPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Refund Policy
        </h1>

        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="text-gray-700 mb-6">
          Thank you for supporting our organization. Donations made through our
          website help us continue our mission and support our programs. Please
          read our refund policy carefully before making a donation.
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Donation Refund Policy
        </h2>

        <p className="text-gray-700 mb-4">
          All donations made through our website are considered voluntary.
          Refunds will generally not be issued once the transaction is
          completed, except in cases of accidental or duplicate payments.
        </p>

        {/* Section 2 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Eligibility for Refund
        </h2>

        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Duplicate transaction</li>
          <li>Incorrect donation amount entered</li>
          <li>Technical error during payment</li>
        </ul>

        {/* Section 3 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Refund Request Process
        </h2>

        <p className="text-gray-700 mb-4">
          If you believe a refund is required, please contact us within 7 days
          of the transaction with your payment details, including transaction
          ID, date, and donation amount.
        </p>

        {/* Section 4 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Processing Time
        </h2>

        <p className="text-gray-700 mb-4">
          Approved refunds will be processed within 7–10 working days and will
          be credited back to the original payment method used during the
          transaction.
        </p>

        {/* Section 5 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Contact Us
        </h2>

        <p className="text-gray-700">
          For refund requests or questions regarding this policy, please contact:
        </p>

        <p className="text-gray-700 mt-2">
          Email: support@example.com
        </p>

      </div>
    </div>
  );
}