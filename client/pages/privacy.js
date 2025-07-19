import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | CoverMart</title>
        <meta name="description" content="Privacy Policy for CoverMart" />
      </Head>
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
          <div className="prose prose-lg text-gray-500">
            <p>Last updated: July 19, 2025</p>
            
            <h2>1. Introduction</h2>
            <p>
              CoverMart ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by CoverMart when you use our website (covermart.com) and our services.
            </p>
            
            <h2>2. Information We Collect</h2>
            <p>We collect information that you provide directly to us, such as:</p>
            <ul>
              <li>Contact information (name, email address, phone number, shipping and billing address)</li>
              <li>Account information (username, password)</li>
              <li>Payment information (credit card details, banking information)</li>
              <li>Order history and preferences</li>
              <li>Communications you send to us</li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about orders, products, and services</li>
              <li>Provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send promotional emails and updates (with your consent)</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
            
            <h2>4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Service providers who perform services on our behalf (payment processors, shipping companies)</li>
              <li>Professional advisors (lawyers, accountants, insurers)</li>
              <li>Government authorities when required by law</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
            
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
            
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your information (subject to legal requirements)</li>
              <li>Object to or restrict certain processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            
            <h2>7. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can manage cookie preferences through your browser settings.
            </p>
            
            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date.
            </p>
            
            <h2>9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: support@covermart.com<br />
              Phone: +91 1234567890
            </p>
            
            <div className="mt-8">
              <Link href="/" className="text-purple-600 hover:text-purple-800">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
