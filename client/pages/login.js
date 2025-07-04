import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../utils/AuthContext';
import Spinner from '../components/ui/Spinner';
import Head from 'next/head';
import { loadGoogleScript, initGoogleAuth } from '../utils/googleAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);
  
  const googleButtonRef = useRef(null);
  
  const router = useRouter();
  const { login, googleLogin, getGoogleClientId, isAuthenticated } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = router.query.redirect || '/';
      router.push(redirect);
    }
  }, [isAuthenticated, router]);

  // Initialize Google Auth
  useEffect(() => {
    if (typeof window !== 'undefined' && !googleInitialized) {
      loadGoogleScript(() => {
        const clientId = getGoogleClientId();
        initGoogleAuth(clientId, (auth) => {
          setGoogleInitialized(true);
        });
      });
    }
  }, [getGoogleClientId, googleInitialized]);

  // Form validation
  const validate = () => {
    const errors = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validate();
    setFormErrors(errors);
    
    // If there are errors, don't submit
    if (Object.keys(errors).length > 0) return;
    
    setIsSubmitting(true);
    setLoginError('');
    
    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setLoginError(result.error);
        setIsSubmitting(false);
        return;
      }
      
      // Redirect to the page they were trying to access or to homepage
      const redirect = router.query.redirect || '/';
      router.push(redirect);
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    if (!googleInitialized || !window.gapi) {
      setLoginError('Google authentication is not initialized yet. Please try again.');
      return;
    }
    
    setIsGoogleLoading(true);
    setLoginError('');
    
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      
      if (!googleUser) {
        throw new Error('Google sign-in failed');
      }
      
      // Get auth response
      const authResponse = googleUser.getAuthResponse();
      const profile = googleUser.getBasicProfile();
      
      // Create response object similar to what Google API returns
      const googleResponse = {
        tokenId: authResponse.id_token,
        profileObj: {
          googleId: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          imageUrl: profile.getImageUrl()
        }
      };
      
      // Process with our auth context
      const result = await googleLogin(googleResponse);
      
      if (!result.success) {
        setLoginError(result.error);
        setIsGoogleLoading(false);
        return;
      }
      
      // Redirect to the page they were trying to access or to homepage
      const redirect = router.query.redirect || '/';
      router.push(redirect);
    } catch (error) {
      console.error('Google login error:', error);
      setLoginError('Google login failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | CoverMart</title>
      </Head>
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto bg-dark-200 p-8 rounded-lg shadow-md border border-dark-100">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-white mb-2">Login to Your Account</h2>
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link 
                href={router.query.redirect ? `/register?redirect=${router.query.redirect}` : '/register'} 
                className="font-medium text-accent-400 hover:text-accent-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        
          {loginError && (
            <div className="mb-4 bg-red-800 text-white p-3 rounded-md text-sm border border-red-600">
              {loginError}
            </div>
          )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border ${
                  formErrors.email ? 'border-red-500' : 'border-dark-100'
                } rounded-md shadow-sm placeholder-gray-500 bg-dark-300 text-white focus:outline-none focus:ring-accent-400 focus:border-accent-400 sm:text-sm`}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none block w-full px-3 py-2 border ${
                  formErrors.password ? 'border-red-500' : 'border-dark-100'
                } rounded-md shadow-sm placeholder-gray-500 bg-dark-300 text-white focus:outline-none focus:ring-accent-400 focus:border-accent-400 sm:text-sm`}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-dark-100 rounded bg-dark-300"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-accent-400 hover:text-accent-300">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:bg-accent-800 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Spinner size="small" color="white" /> : 'Login'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-200 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              id="google-login-button"
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              ref={googleButtonRef}
              className="w-full inline-flex justify-center py-2 px-4 border border-dark-100 rounded-md shadow-sm bg-dark-300 text-sm font-medium text-white hover:bg-dark-100 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Sign in with Google</span>
              {isGoogleLoading ? (
                <Spinner size="small" color="white" className="mr-2" />
              ) : (
                <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              )}
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
