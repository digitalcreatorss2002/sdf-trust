import React from "react";

export default function TermsConditions() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="text-gray-700 mb-6">
          By accessing and using our website, you agree to comply with and be
          bound by the following Terms and Conditions. Please read them
          carefully before using our website.
        </p>

        {/* Section 1 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Use of Website
        </h2>

        <p className="text-gray-700 mb-4">
          The content on this website is for general information and charitable
          purposes only. You agree to use this website in a lawful manner and
          not misuse the information or services provided.
        </p>

        {/* Section 2 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Donations
        </h2>

        <p className="text-gray-700 mb-4">
          All donations made through our website are voluntary. By making a
          donation, you agree that the funds will be used to support our
          programs and charitable activities.
        </p>

        {/* Section 3 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Intellectual Property
        </h2>

        <p className="text-gray-700 mb-4">
          All content, including text, images, logos, and graphics on this
          website, is the property of our organization unless otherwise stated.
          Unauthorized use or reproduction is prohibited.
        </p>

        {/* Section 4 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Limitation of Liability
        </h2>

        <p className="text-gray-700 mb-4">
          We are not responsible for any direct or indirect damages arising
          from the use of our website or services.
        </p>

        {/* Section 5 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Changes to Terms
        </h2>

        <p className="text-gray-700 mb-4">
          We may update these Terms & Conditions at any time without prior
          notice. Changes will be effective immediately upon posting on this
          page.
        </p>

        {/* Section 6 */}
        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Contact Us
        </h2>

        <p className="text-gray-700">
          If you have any questions regarding these Terms & Conditions, please
          contact us:
        </p>

        <p className="text-gray-700 mt-2">
          Email: support@example.com
        </p>

      </div>
    </div>
  );
}