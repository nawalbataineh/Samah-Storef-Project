import { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/cartApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { error } = useToast();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (variantId, quantity) => {
    try {
      setLoading(true);
      const data = await cartApi.addItem(variantId, quantity);
      setCart(data);
      return data;
    } catch (err) {
      error('فشل في إضافة المنتج للسلة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (variantId, quantity) => {
    try {
      setLoading(true);
      const data = await cartApi.updateQuantity(variantId, quantity);
      setCart(data);
    } catch (err) {
      error('فشل في تحديث الكمية');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (variantId) => {
    try {
      setLoading(true);
      const data = await cartApi.removeItem(variantId);
      setCart(data);
    } catch (err) {
      error('فشل في حذف المنتج');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const data = await cartApi.clearCart();
      setCart(data);
    } catch (err) {
      error('فشل في تفريغ السلة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart?.items?.length || 0;
  const cartTotal = cart?.subtotal || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      cartCount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart: fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

