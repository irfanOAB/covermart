import Head from 'next/head';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms and Conditions | CoverMart</title>
        <meta name="description" content="Terms and Conditions for CoverMart" />
      </Head>
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Terms and Conditions</h1>
          <div className="prose prose-lg text-gray-500">
            <p>Last updated: July 19, 2025</p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to CoverMart. These Terms and Conditions govern your use of the CoverMart website and services. By accessing or using our website, you agree to be bound by these Terms.
            </p>
            
            <h2>2. Definitions</h2>
            <p>
              "Company," "we," "us," or "our" refers to CoverMart.<br />
              "Website" refers to covermart.com.<br />
              "Service" refers to the products, services, and website offered by CoverMart.<br />
              "You" refers to the individual accessing or using our Service.
            </p>
            
            <h2>3. Account Registration</h2>
            <p>
              To access certain features of our website, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
            </p>
            
            <h2>4. Products and Orders</h2>
            <p>
              Product descriptions, images, and prices are subject to change without notice. We reserve the right to limit quantities, reject, or cancel orders at our discretion.
            </p>
            
            <h2>5. Pricing and Payment</h2>
            <p>
              All prices are in Indian Rupees (INR) and include applicable taxes. Payment must be made at the time of placing an order through the payment methods we offer.
            </p>
            
            <h2>6. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, and software, is the property of CoverMart and is protected by copyright and other intellectual property laws.
            </p>
            
            <h2>7. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our service for any illegal purpose</li>
              <li>Violate any laws or regulations</li>
              <li>Interfere with the security or functionality of our website</li>
              <li>Impersonate any person or entity</li>
              <li>Engage in any activity that could harm our website or systems</li>
            </ul>
            
            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, CoverMart shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our service.
            </p>
            
            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless CoverMart from any claims, damages, liabilities, costs, or expenses arising from your use of our service or violation of these Terms.
            </p>
            
            <h2>10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            
            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. The updated version will be effective as of the "Last Updated" date.
            </p>
            
            <h2>12. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us at:
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
