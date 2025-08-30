// User related types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  cartItems: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

// Product related types
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: 'electronics' | 'fashion' | 'books';
  stock: number;
  image: string;
  isFeatured: boolean;
  sold: number;
  reviews: number;
  ratings: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreate {
  name: string;
  price: number;
  description: string;
  category: 'electronics' | 'fashion' | 'books';
  stock: number;
  image: string;
  isFeatured?: boolean;
}

// Cart related types
export interface CartItem {
  product: Product | string;
  quantity: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

// Order related types
export interface Order {
  _id: string;
  user: string;
  products: {
    product: string | Product;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Coupon related types
export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValidateCouponRequest {
  code: string;
}

// Payment related types
export interface CheckoutSessionRequest {
  products: {
    product: string;
    quantity: number;
  }[];
  couponCode?: string;
}

export interface CheckoutSuccessRequest {
  sessionId: string;
}

// Analytics types
export interface Analytics {
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  totalUsers: number;
}

// API Response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  results?: number;
}

export interface ApiError {
  status: 'error';
  message: string;
}

// UI Component types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Filter and Search types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'ratings' | 'sold';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  page?: number;
  limit?: number;
}

// Context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface CartContextType {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}
