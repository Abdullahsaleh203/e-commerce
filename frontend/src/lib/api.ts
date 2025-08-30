import { apiClient } from './api-client';
import type {
  User,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  Product,
  ProductCreate,
  CartItem,
  AddToCartRequest,
  UpdateQuantityRequest,
  Order,
  Coupon,
  ValidateCouponRequest,
  CheckoutSessionRequest,
  CheckoutSuccessRequest,
  Analytics,
  ApiResponse,
  ProductFilters,
} from '@/types';

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response;
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', credentials);
    return response;
  },

  logout: async (): Promise<void> => {
    await apiClient.get('/auth/logout');
  },

  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/profile');
    return response;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh-token');
    return response;
  },
};

// Products API
export const productsApi = {
  getAllProducts: async (): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await apiClient.get<ApiResponse<{ products: Product[] }>>('/products');
    return response;
  },

  getFeaturedProducts: async (): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await apiClient.get<ApiResponse<{ products: Product[] }>>('/products/featured');
    return response;
  },

  getProductsByCategory: async (category: string): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await apiClient.get<ApiResponse<{ products: Product[] }>>(`/products/category/${category}`);
    return response;
  },

  getRecommendedProducts: async (): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await apiClient.get<ApiResponse<{ products: Product[] }>>('/products/recommendations');
    return response;
  },

  createProduct: async (product: ProductCreate): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient.post<ApiResponse<{ product: Product }>>('/products', product);
    return response;
  },

  updateProduct: async (id: string, updates: Partial<ProductCreate>): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient.patch<ApiResponse<{ product: Product }>>(`/products/${id}`, updates);
    return response;
  },

  toggleFeaturedProduct: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient.patch<ApiResponse<{ product: Product }>>(`/products/${id}`);
    return response;
  },

  deleteProduct: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>(`/products/${id}`);
    return response;
  },

  searchProducts: async (filters: ProductFilters): Promise<ApiResponse<{ products: Product[] }>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    const response = await apiClient.get<ApiResponse<{ products: Product[] }>>url);
    return response;
  },
};

// Cart API
export const cartApi = {
  getCartProducts: async (): Promise<ApiResponse<{ cartItems: CartItem[] }>> => {
    const response = await apiClient.get<ApiResponse<{ cartItems: CartItem[] }>>('/cart');
    return response;
  },

  addToCart: async (request: AddToCartRequest): Promise<ApiResponse<{ cartItems: CartItem[] }>> => {
    const response = await apiClient.post<ApiResponse<{ cartItems: CartItem[] }>>('/cart', request);
    return response;
  },

  updateQuantity: async (productId: string, request: UpdateQuantityRequest): Promise<ApiResponse<{ cartItems: CartItem[] }>> => {
    const response = await apiClient.put<ApiResponse<{ cartItems: CartItem[] }>>(`/cart/${productId}`, request);
    return response;
  },

  removeAllFromCart: async (): Promise<ApiResponse> => {
    const response = await apiClient.delete<ApiResponse>('/cart');
    return response;
  },
};

// Payment API
export const paymentApi = {
  createCheckoutSession: async (request: CheckoutSessionRequest): Promise<ApiResponse<{ sessionId: string; url: string }>> => {
    const response = await apiClient.post<ApiResponse<{ sessionId: string; url: string }>>('/payment/create-checkout-session', request);
    return response;
  },

  checkoutSuccess: async (request: CheckoutSuccessRequest): Promise<ApiResponse<{ order: Order }>> => {
    const response = await apiClient.post<ApiResponse<{ order: Order }>>('/payment/checkout-success', request);
    return response;
  },
};

// Coupons API
export const couponsApi = {
  getCoupons: async (): Promise<ApiResponse<{ coupons: Coupon[] }>> => {
    const response = await apiClient.get<ApiResponse<{ coupons: Coupon[] }>>('/coupons');
    return response;
  },

  validateCoupon: async (request: ValidateCouponRequest): Promise<ApiResponse<{ coupon: Coupon; discountAmount: number }>> => {
    const response = await apiClient.post<ApiResponse<{ coupon: Coupon; discountAmount: number }>>('/coupons/validate', request);
    return response;
  },
};

// Analytics API
export const analyticsApi = {
  getAnalytics: async (): Promise<ApiResponse<{ analytics: Analytics }>> => {
    const response = await apiClient.get<ApiResponse<{ analytics: Analytics }>>('/analytics');
    return response;
  },
};

// Orders API (if needed for order history)
export const ordersApi = {
  getUserOrders: async (): Promise<ApiResponse<{ orders: Order[] }>> => {
    const response = await apiClient.get<ApiResponse<{ orders: Order[] }>>('/orders');
    return response;
  },

  getOrderById: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
    const response = await apiClient.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
    return response;
  },
};

// Export all APIs
export const api = {
  auth: authApi,
  products: productsApi,
  cart: cartApi,
  payment: paymentApi,
  coupons: couponsApi,
  analytics: analyticsApi,
  orders: ordersApi,
};
