import Head from 'next/head';
import Link from 'next/link';

export default function CancellationRefundPolicy() {
  return (
    <>
      <Head>
        <title>Cancellation and Refund Policy | CoverMart</title>
        <meta name="description" content="Cancellation and Refund Policy for CoverMart" />
      </Head>
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Cancellation and Refund Policy</h1>
          <div className="prose prose-lg text-gray-500">
            <p>Last updated: July 19, 2025</p>
            
            <h2>1. Order Cancellation</h2>
            <p>
              You can cancel your order under the following conditions:
            </p>
            <ul>
              <li>Before the order is shipped: Full refund will be processed</li>
              <li>After the order is shipped but before delivery: Cancellation is subject to a shipping and handling fee</li>
              <li>Orders cannot be cancelled once they have been delivered</li>
            </ul>
            <p>
              To cancel an order, please contact our customer support team at support@covermart.com or call us at +91 1234567890 with your order details.
            </p>
            
            <h2>2. Return Policy</h2>
            <p>
              We accept returns within 30 days of delivery under the following conditions:
            </p>
            <ul>
              <li>The product must be unused, unworn, and in its original packaging</li>
              <li>The product must not be damaged</li>
              <li>All tags and labels must be intact</li>
              <li>You must have the original receipt or proof of purchase</li>
            </ul>
            <p>
              Certain products cannot be returned due to hygiene reasons or personal use considerations. These will be clearly marked on the product page.
            </p>
            
            <h2>3. Refund Process</h2>
            <p>
              Once we receive and inspect the returned item, we will notify you about the status of your refund:
            </p>
            <ul>
              <li>If approved: Your refund will be processed within 5-7 business days</li>
              <li>For credit/debit card payments: Refunds will be credited back to the original payment method</li>
              <li>For Cash on Delivery (COD) orders: Refunds will be processed via bank transfer or store credit</li>
            </ul>
            <p>
              Please note that it may take an additional 3-5 business days for the refund to appear in your account, depending on your financial institution.
            </p>
            
            <h2>4. Refund Amount</h2>
            <p>
              The refund amount will include:
            </p>
            <ul>
              <li>The full product price (if the return is approved)</li>
              <li>Original shipping charges (only if the return is due to our error)</li>
            </ul>
            <p>
              Return shipping costs are generally borne by the customer unless the return is due to our error (damaged, defective, or incorrect item).
            </p>
            
            <h2>5. Damaged or Defective Products</h2>
            <p>
              If you receive a damaged or defective product:
            </p>
            <ul>
              <li>Notify us within 48 hours of delivery</li>
              <li>Provide clear photos of the damage or defect</li>
              <li>We will arrange for a replacement or full refund including shipping charges</li>
            </ul>
            
            <h2>6. Cancellation of Digital Products</h2>
            <p>
              Digital products or services are non-refundable once the download or access has been provided, unless the product is defective or not as described.
            </p>
            
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about our Cancellation and Refund Policy, please contact us:
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
