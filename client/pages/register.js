import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../utils/AuthContext';
import Spinner from '../components/ui/Spinner';
import Head from 'next/head';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = router.query.redirect || '/';
      router.push(redirect);
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form validation
  const validate = () => {
    const errors = {};
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    // Indian phone number validation (10 digits)
    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
    setRegisterError('');

    try {
      const { name, email, phone, password } = formData;
      const result = await register({ name, email, phone, password });

      if (!result.success) {
        setRegisterError(result.error);
        setIsSubmitting(false);
        return;
      }

      // Redirect to the page they were trying to access or to homepage
      const redirect = router.query.redirect || '/';
      router.push(redirect);
    } catch (error) {
      setRegisterError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | CoverMart</title>
      </Head>
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto bg-dark-200 p-8 rounded-lg shadow-md border border-dark-100">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-white mb-2">Create an Account</h2>
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                href={router.query.redirect ? `/login?redirect=${router.query.redirect}` : '/login'}
                className="font-medium text-accent-400 hover:text-accent-300"
              >
                Login
              </Link>
            </p>
          </div>

          {registerError && (
            <div className="mb-4 bg-red-800 text-white p-3 rounded-md text-sm border border-red-600">
              {registerError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-dark-100'
                    } rounded-md shadow-sm placeholder-gray-500 bg-dark-300 text-white focus:outline-none focus:ring-accent-400 focus:border-accent-400 sm:text-sm`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-dark-100'
                    } rounded-md shadow-sm placeholder-gray-500 bg-dark-300 text-white focus:outline-none focus:ring-accent-400 focus:border-accent-400 sm:text-sm`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-dark-100'
                    } rounded-md shadow-sm placeholder-gray-500 bg-dark-300 text-white focus:outline-none focus:ring-accent-400 focus:border-accent-400 sm:text-sm`}
                  placeholder="10-digit mobile number"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.phone}</p>
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-dark-100'
                    } rounded-md shadow-sm placeholder-gray-500 bg-dark-300 text-white focus:outline-none focus:ring-accent-400 focus:border-accent-400 sm:text-sm`}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-dark-100'
                    } rounded-md shadow-sm placeholder-gray-500 bg-dark-300 text-white focus:outline-none focus:ring-accent-400 focus:border-accent-400 sm:text-sm`}
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-dark-100 rounded bg-dark-300"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-white">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-accent-400 hover:text-accent-300">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="font-medium text-accent-400 hover:text-accent-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:bg-accent-800 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Spinner size="small" color="white" /> : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
