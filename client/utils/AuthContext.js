import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from './api';

// Google client ID
const GOOGLE_CLIENT_ID = '440730683283-9vt3ulu19js7t7e2hbk89nfj3i43udfi.apps.googleusercontent.com';

// Process Google login response
const processGoogleLogin = async (googleResponse) => {
  try {
    // In a real app, you would send this token to your backend
    // For now, we'll create a user object from the Google response
    const { profileObj, tokenId } = googleResponse;

    return {
      success: true,
      data: {
        _id: `google-${profileObj.googleId}`,
        name: profileObj.name,
        email: profileObj.email,
        token: tokenId,
        isAdmin: false,
        avatar: profileObj.imageUrl
      }
    };
  } catch (error) {
    console.error('Google login processing error:', error);
    return {
      success: false,
      error: 'Failed to process Google login'
    };
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on first load
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post('/users/login', { email, password });

      // Store user data and token in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/users/register', userData);

      // Store user data and token in localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    router.push('/');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const { data } = await api.put('/users/profile', userData);

      const updatedUser = { ...user, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed',
      };
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const googleLogin = async (googleResponse) => {
    try {
      setLoading(true);

      if (!googleResponse) {
        return { success: false, error: 'No Google response received' };
      }

      const result = await processGoogleLogin(googleResponse);

      if (result.success) {
        localStorage.setItem('userInfo', JSON.stringify(result.data));
        setUser(result.data);
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'Google login failed' };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: error.message || 'Google login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  // Get Google client ID
  const getGoogleClientId = () => GOOGLE_CLIENT_ID;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        googleLogin,
        getGoogleClientId,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
