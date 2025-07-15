import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Process image URL
  const processImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/images')) return imageUrl;
    if (!imageUrl.startsWith('/')) return `/images/products/${imageUrl}`;
    return imageUrl;
  };

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // ✅ Update count & total whenever items change
  useEffect(() => {
    calculateCartSummary();
  }, [cartItems]);

  const loadCart = () => {
    setLoading(true);
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = (updatedCartItems) => {
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const calculateCartSummary = () => {
    const count = cartItems.reduce((total, item) => total + item.qty, 0);
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
    setCartCount(count);
    setCartTotal(totalPrice);
  };

  // ✅ Add item to cart (only localStorage)
  const addToCart = async (product, qty = 1) => {
    try {
      setLoading(true);

      const existingItem = cartItems.find(
        (item) => item.product === product._id
      );

      let updatedCartItems;

      if (existingItem) {
        updatedCartItems = cartItems.map((item) =>
          item.product === product._id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        const newItem = {
          product: product._id,
          name: product.name,
          image: processImageUrl(
            product.images && product.images.length > 0
              ? product.images[0]
              : '/images/products/placeholder.jpg'
          ),
          price:
            product.discountPrice > 0 ? product.discountPrice : product.price,
          category: product.category || '',
          qty: qty,
        };
        updatedCartItems = [...cartItems, newItem];
      }

      setCartItems(updatedCartItems);
      saveCart(updatedCartItems);

      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: 'Failed to add item to cart' };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update cart item quantity
  const updateCartItemQty = async (productId, qty) => {
    try {
      setLoading(true);

      let updatedCartItems;
      if (qty <= 0) {
        updatedCartItems = cartItems.filter((item) => item.product !== productId);
      } else {
        updatedCartItems = cartItems.map((item) =>
          item.product === productId ? { ...item, qty } : item
        );
      }

      setCartItems(updatedCartItems);
      saveCart(updatedCartItems);

      return { success: true };
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false, error: 'Failed to update cart' };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove item
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const updatedCartItems = cartItems.filter(
        (item) => item.product !== productId
      );
      setCartItems(updatedCartItems);
      saveCart(updatedCartItems);
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: 'Failed to remove item from cart' };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setCartItems([]);
      localStorage.removeItem('cart');
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: 'Failed to clear cart' };
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
