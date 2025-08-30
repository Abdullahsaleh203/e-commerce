'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';
import type { CartItem, CartContextType, Product } from '@/types';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !authLoading) {
      loadCart();
    } else if (!authLoading && !user) {
      setCart([]);
    }
  }, [user, authLoading]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const response = await api.cart.getCartProducts();
      if (response.status === 'success' && response.data?.cartItems) {
        setCart(response.data.cartItems);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.cart.addToCart({ productId, quantity });
      
      if (response.status === 'success' && response.data?.cartItems) {
        setCart(response.data.cartItems);
        toast.success('Item added to cart!');
      }
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) {
      toast.error('Please login to update cart');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.cart.updateQuantity(productId, { quantity });
      
      if (response.status === 'success' && response.data?.cartItems) {
        setCart(response.data.cartItems);
        
        if (quantity === 0) {
          toast.success('Item removed from cart');
        } else {
          toast.success('Cart updated!');
        }
      }
    } catch (error: any) {
      console.error('Failed to update cart:', error);
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    await updateQuantity(productId, 0);
  };

  const clearCart = async () => {
    if (!user) {
      toast.error('Please login to clear cart');
      return;
    }

    try {
      setIsLoading(true);
      await api.cart.removeAllFromCart();
      setCart([]);
      toast.success('Cart cleared!');
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const product = item.product as Product;
      return total + (product.price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItem = (productId: string): CartItem | undefined => {
    return cart.find(item => {
      const product = item.product as Product;
      return product._id === productId;
    });
  };

  const isInCart = (productId: string): boolean => {
    return cart.some(item => {
      const product = item.product as Product;
      return product._id === productId;
    });
  };

  const getItemQuantity = (productId: string): number => {
    const item = getCartItem(productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Additional cart hooks for convenience
export function useCartItem(productId: string) {
  const { cart } = useCart();
  
  const cartItem = cart.find(item => {
    const product = item.product as Product;
    return product._id === productId;
  });

  return {
    isInCart: !!cartItem,
    quantity: cartItem?.quantity || 0,
    cartItem,
  };
}

export function useCartSummary() {
  const { cart, getCartTotal, getCartItemsCount } = useCart();
  
  const subtotal = getCartTotal();
  const itemsCount = getCartItemsCount();
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
    itemsCount,
    isEmpty: cart.length === 0,
    freeShippingEligible: subtotal >= 50,
    freeShippingRemaining: Math.max(0, 50 - subtotal),
  };
}
