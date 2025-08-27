import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse, ApiError } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
      timeout: 10000,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error) => {
        const apiError: ApiError = {
          status: 'error',
          message: error.response?.data?.message || error.message || 'An unexpected error occurred',
        };

        // Handle specific error cases
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          Cookies.remove('token');
          window.location.href = '/auth/login';
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<ApiResponse<T>>(config);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// API service classes
export class AuthService {
  static async login(credentials: { email: string; password: string }) {
    return apiClient.post('/auth/login', credentials);
  }

  static async signup(credentials: { username: string; email: string; password: string }) {
    return apiClient.post('/auth/signup', credentials);
  }

  static async logout() {
    return apiClient.get('/auth/logout');
  }

  static async getProfile() {
    return apiClient.get('/auth/profile');
  }

  static async refreshToken() {
    return apiClient.post('/auth/refresh-token');
  }
}

export class ProductService {
  static async getAllProducts() {
    return apiClient.get('/products');
  }

  static async getFeaturedProducts() {
    return apiClient.get('/products/featured');
  }

  static async getProductsByCategory(category: string) {
    return apiClient.get(`/products/category/${category}`);
  }

  static async getRecommendedProducts() {
    return apiClient.get('/products/recommendations');
  }

  static async createProduct(product: any) {
    return apiClient.post('/products', product);
  }

  static async toggleFeaturedProduct(id: string) {
    return apiClient.patch(`/products/${id}`);
  }

  static async deleteProduct(id: string) {
    return apiClient.delete(`/products/${id}`);
  }
}

export class CartService {
  static async getCartProducts() {
    return apiClient.get('/cart');
  }

  static async addToCart(productId: string, quantity: number = 1) {
    return apiClient.post('/cart', { productId, quantity });
  }

  static async updateQuantity(productId: string, quantity: number) {
    return apiClient.put(`/cart/${productId}`, { quantity });
  }

  static async removeAllFromCart() {
    return apiClient.delete('/cart');
  }
}

export class PaymentService {
  static async createCheckoutSession(data: any) {
    return apiClient.post('/payment/create-checkout-session', data);
  }

  static async checkoutSuccess(sessionId: string) {
    return apiClient.post('/payment/checkout-success', { sessionId });
  }
}

export class CouponService {
  static async getCoupons() {
    return apiClient.get('/coupons');
  }

  static async validateCoupon(code: string) {
    return apiClient.post('/coupons/validate', { code });
  }
}

export class AnalyticsService {
  static async getAnalytics() {
    return apiClient.get('/analytics');
  }
}
