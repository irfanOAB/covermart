import '../styles/globals.css';
import { AuthProvider } from '../utils/AuthContext';
import { CartProvider } from '../utils/CartContext';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  // Check if the current page is an admin page
  const isAdminPage = router.pathname.startsWith('/admin');
  
  // Check if the current page requires custom layout
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AuthProvider>
      <CartProvider>
        {isAdminPage || Component.disableLayout ? (
          getLayout(<Component {...pageProps} />)
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </CartProvider>
    </AuthProvider>
  );
}
