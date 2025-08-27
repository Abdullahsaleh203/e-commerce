'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartService } from '@/lib/api';
import { CartItem, Product } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Calculate derived state
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const product = item.product as Product;
    return sum + (product.price * item.quantity);
  }, 0);

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const cartData = await CartService.getCartProducts();
      setItems(cartData.cartItems || []);
    } catch (error: any) {
      console.error('Failed to load cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      await CartService.addToCart(product._id, quantity);
      
      // Update local state optimistically
      setItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(
          item => (item.product as Product)._id === product._id
        );

        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity
          };
          return updatedItems;
        } else {
          // Add new item
          return [...prevItems, { product, quantity }];
        }
      });

      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      toast.error(error.message || 'Failed to add to cart');
      // Refresh cart to sync with server state
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      await CartService.updateQuantity(productId, quantity);
      
      // Update local state
      setItems(prevItems =>
        prevItems.map(item => {
          const product = item.product as Product;
          if (product._id === productId) {
            return { ...item, quantity };
          }
          return item;
        })
      );

      toast.success('Cart updated');
    } catch (error: any) {
      console.error('Failed to update cart:', error);
      toast.error(error.message || 'Failed to update cart');
      // Refresh cart to sync with server state
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      await CartService.updateQuantity(productId, 0);
      
      // Update local state
      setItems(prevItems =>
        prevItems.filter(item => {
          const product = item.product as Product;
          return product._id !== productId;
        })
      );

      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      toast.error(error.message || 'Failed to remove from cart');
      // Refresh cart to sync with server state
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      await CartService.removeAllFromCart();
      setItems([]);
      toast.success('Cart cleared');
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      toast.error(error.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const isInCart = (productId: string): boolean => {
    return items.some(item => {
      const product = item.product as Product;
      return product._id === productId;
    });
  };

  const getCartItemQuantity = (productId: string): number => {
    const item = items.find(item => {
      const product = item.product as Product;
      return product._id === productId;
    });
    return item?.quantity || 0;
  };

  const value = {
    items,
    loading,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    isInCart,
    getCartItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartService } from '@/lib/api';
import { CartItem, Product } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Calculate derived state
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const product = item.product as Product;
    return sum + (product.price * item.quantity);
  }, 0);

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const cartData = await CartService.getCartProducts();
      setItems(cartData.cartItems || []);
    } catch (error: any) {
      console.error('Failed to load cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      await CartService.addToCart(product._id, quantity);
      
      // Update local state optimistically
      setItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(
          item => (item.product as Product)._id === product._id
        );

        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity
          };
          return updatedItems;
        } else {
          // Add new item
          return [...prevItems, { product, quantity }];
        }
      });

      toast.success(`${product.name} added to cart`);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      toast.error(error.message || 'Failed to add to cart');
      // Refresh cart to sync with server state
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      await CartService.updateQuantity(productId, quantity);
      
      // Update local state
      setItems(prevItems =>
        prevItems.map(item => {
          const product = item.product as Product;
          if (product._id === productId) {
            return { ...item, quantity };
          }
          return item;
        })
      );

      toast.success('Cart updated');
    } catch (error: any) {
      console.error('Failed to update cart:', error);
      toast.error(error.message || 'Failed to update cart');
      // Refresh cart to sync with server state
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      await CartService.updateQuantity(productId, 0);
      
      // Update local state
      setItems(prevItems =>
        prevItems.filter(item => {
          const product = item.product as Product;
          return product._id !== productId;
        })
      );

      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      toast.error(error.message || 'Failed to remove from cart');
      // Refresh cart to sync with server state
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      await CartService.removeAllFromCart();
      setItems([]);
      toast.success('Cart cleared');
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      toast.error(error.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const isInCart = (productId: string): boolean => {
    return items.some(item => {
      const product = item.product as Product;
      return product._id === productId;
    });
  };

  const getCartItemQuantity = (productId: string): number => {
    const item = items.find(item => {
      const product = item.product as Product;
      return product._id === productId;
    });
    return item?.quantity || 0;
  };

  const value = {
    items,
    loading,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    isInCart,
    getCartItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
