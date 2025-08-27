// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  cartItems: CartItem[];
  createdAt: string;
  updatedAt: string;
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

export interface AuthResponse {
  status: string;
  token?: string;
  user: User;
}

// Product types
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

// Cart types
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

// Order types
export interface Order {
  _id: string;
  user: string;
  products: {
    product: Product | string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Coupon types
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

// Payment types
export interface CheckoutSession {
  products: {
    product: string;
    quantity: number;
  }[];
  couponCode?: string;
}

export interface CheckoutSuccess {
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

// Form types
export interface FormErrors {
  [key: string]: string;
}

// Filter and search types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price' | 'name' | 'created' | 'rating';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Component props types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
