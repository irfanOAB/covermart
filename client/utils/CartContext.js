import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from './api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const { user } = useAuth();
  
  // Process image URL to ensure it's properly formatted
  const processImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // If it's already an absolute URL (starts with http or https), use it as is
    if (imageUrl.startsWith('http')) return imageUrl;
    // If it's a relative path starting with /images, use it as is
    if (imageUrl.startsWith('/images')) return imageUrl;
    // If it's a relative path without leading slash, add the proper prefix
    if (!imageUrl.startsWith('/')) return `/images/products/${imageUrl}`;
    // Otherwise, use as is (it's already a proper path)
    return imageUrl;
  };

  // Initialize cart and session ID
  useEffect(() => {
    // Generate or retrieve session ID for guest users
    if (!user) {
      let existingSessionId = localStorage.getItem('sessionId');
      if (!existingSessionId) {
        existingSessionId = uuidv4();
        localStorage.setItem('sessionId', existingSessionId);
      }
      setSessionId(existingSessionId);
    }

    // Load cart from localStorage or API
    loadCart();
  }, [user]);

  // Calculate cart count and total whenever cart items change
  useEffect(() => {
    calculateCartSummary();
  }, [cartItems]);

  // Load cart from API or localStorage
  const loadCart = async () => {
    try {
      setLoading(true);
      if (user) {
        // Fetch cart from API for logged in user
        const { data } = await api.get('/cart');
        setCartItems(data.cartItems || []);
      } else {
        // Load from localStorage for guest user
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // If API fails, try to get from localStorage as fallback
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } finally {
      setLoading(false);
    }
  };

  // Save cart to localStorage (for guest users) or API (for logged in users)
  const saveCart = async (updatedCartItems) => {
    try {
      if (user) {
        // Save to API
        await api.post('/cart/update', {
          cartItems: updatedCartItems,
        });
      } else {
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
      }
    } catch (error) {
      console.error('Error saving cart:', error);
      // Save to localStorage as fallback
      localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    }
  };

  // Calculate cart count and total
  const calculateCartSummary = () => {
    const count = cartItems.reduce((total, item) => total + item.qty, 0);
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
    setCartCount(count);
    setCartTotal(totalPrice);
  };

  // Add item to cart
  const addToCart = async (product, qty = 1, color = '') => {
    try {
      setLoading(true);
      
      // Check if item exists in cart
      const existingItem = cartItems.find(
        (item) => item.product === product._id && item.color === color
      );

      let updatedCartItems;

      if (existingItem) {
        // Update quantity if item exists
        updatedCartItems = cartItems.map((item) =>
          item.product === product._id && item.color === color
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        // Add new item
        const newItem = {
          product: product._id,
          name: product.name,
          image: processImageUrl(product.images && product.images.length > 0 ? product.images[0] : '/images/products/placeholder.jpg'),
          price: product.discountPrice > 0 ? product.discountPrice : product.price,
          category: product.category || '',
          color: color,
          qty: qty,
        };
        updatedCartItems = [...cartItems, newItem];
      }

      // Update state
      setCartItems(updatedCartItems);
      
      // Save to API or localStorage
      if (user) {
        await api.post('/cart/add', {
          productId: product._id,
          qty,
          color,
        });
      } else {
        await saveCart(updatedCartItems);
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add item to cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItemQty = async (productId, qty, color = '') => {
    try {
      setLoading(true);

      let updatedCartItems;

      if (qty <= 0) {
        // Remove item if quantity is 0 or negative
        updatedCartItems = cartItems.filter(
          (item) => !(item.product === productId && item.color === color)
        );
      } else {
        // Update quantity
        updatedCartItems = cartItems.map((item) =>
          item.product === productId && item.color === color
            ? { ...item, qty }
            : item
        );
      }

      // Update state
      setCartItems(updatedCartItems);
      
      // Save to API or localStorage
      if (user) {
        await api.put('/cart/update', {
          productId,
          qty,
          color,
        });
      } else {
        await saveCart(updatedCartItems);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId, color = '') => {
    try {
      setLoading(true);
      
      // Filter out the item to remove
      const updatedCartItems = cartItems.filter(
        (item) => !(item.product === productId && item.color === color)
      );
      
      // Update state
      setCartItems(updatedCartItems);
      
      // Save to API or localStorage
      if (user) {
        await api.delete(`/cart/${productId}`, {
          data: { color },
        });
      } else {
        await saveCart(updatedCartItems);
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to remove item from cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      
      // Clear state
      setCartItems([]);
      
      // Clear API or localStorage
      if (user) {
        await api.delete('/cart');
      } else {
        localStorage.removeItem('cart');
      }

      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to clear cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Merge guest cart with user cart after login
  const mergeWithUserCart = async () => {
    if (!user || !sessionId || cartItems.length === 0) return;

    try {
      setLoading(true);
      await api.post('/cart/merge', { sessionId });
      
      // Reload cart after merging
      await loadCart();
    } catch (error) {
      console.error('Error merging cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        mergeWithUserCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
