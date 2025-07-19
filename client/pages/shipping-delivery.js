import Head from 'next/head';
import Link from 'next/link';

export default function ShippingDeliveryPolicy() {
  return (
    <>
      <Head>
        <title>Shipping and Delivery Policy | CoverMart</title>
        <meta name="description" content="Shipping and Delivery Policy for CoverMart" />
      </Head>
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shipping and Delivery Policy</h1>
          <div className="prose prose-lg text-gray-500">
            <p>Last updated: July 19, 2025</p>
            
            <h2>1. Shipping Information</h2>
            <p>
              CoverMart ships to all locations within India. We strive to deliver your products in the most efficient and timely manner.
            </p>
            
            <h2>2. Processing Time</h2>
            <p>
              All orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day.
            </p>
            
            <h2>3. Shipping Methods and Timeframes</h2>
            <p>
              We offer the following shipping options:
            </p>
            <ul>
              <li><strong>Standard Shipping:</strong> 3-5 business days</li>
              <li><strong>Express Shipping:</strong> 1-2 business days (available for select locations)</li>
            </ul>
            <p>
              Please note that these timeframes are estimates and may vary based on your location and other external factors.
            </p>
            
            <h2>4. Shipping Costs</h2>
            <p>
              Our shipping costs are as follows:
            </p>
            <ul>
              <li><strong>Free Shipping:</strong> On all orders above ₹499</li>
              <li><strong>Standard Shipping:</strong> ₹49 for orders below ₹499</li>
              <li><strong>Express Shipping:</strong> Additional ₹100 (when available)</li>
            </ul>
            
            <h2>5. Order Tracking</h2>
            <p>
              Once your order is shipped, you will receive a confirmation email with a tracking number and link. You can track your order status through:
            </p>
            <ul>
              <li>Your account dashboard on our website</li>
              <li>The tracking link provided in the shipping confirmation email</li>
              <li>Contacting our customer support team</li>
            </ul>
            
            <h2>6. Delivery Information</h2>
            <p>
              Please ensure that someone is available at the delivery address to receive the package. If no one is available:
            </p>
            <ul>
              <li>The delivery person may attempt delivery again on the next business day</li>
              <li>The package may be left at a secure location (if you've provided delivery instructions)</li>
              <li>The package may be returned to our warehouse after three failed delivery attempts</li>
            </ul>
            
            <h2>7. International Shipping</h2>
            <p>
              Currently, we only ship within India. We plan to expand our shipping services to international locations in the future.
            </p>
            
            <h2>8. Shipping Delays</h2>
            <p>
              While we strive to deliver all orders within the estimated timeframes, delays may occur due to:
            </p>
            <ul>
              <li>Adverse weather conditions</li>
              <li>Natural disasters</li>
              <li>Public holidays</li>
              <li>Unforeseen logistics issues</li>
            </ul>
            <p>
              We will notify you of any significant delays affecting your order.
            </p>
            
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about our Shipping and Delivery Policy, please contact us:
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
