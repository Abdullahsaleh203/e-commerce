'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { apiClient } from '@/lib/api-client';
import type { User, LoginCredentials, SignupCredentials, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = apiClient.getAuthToken();
      if (token) {
        await loadUserProfile();
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      apiClient.removeAuthToken();
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const response = await api.auth.getProfile();
      if (response.status === 'success' && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      apiClient.removeAuthToken();
      setUser(null);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await api.auth.login(credentials);
      
      if (response.status === 'success' && response.token && response.user) {
        apiClient.setAuthToken(response.token);
        setUser(response.user);
        toast.success('Logged in successfully!');
        router.push('/');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      setIsLoading(true);
      const response = await api.auth.signup(credentials);
      
      if (response.status === 'success' && response.token && response.user) {
        apiClient.setAuthToken(response.token);
        setUser(response.user);
        toast.success('Account created successfully!');
        router.push('/');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      apiClient.removeAuthToken();
      setUser(null);
      toast.success('Logged out successfully!');
      router.push('/auth/login');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.auth.refreshToken();
      
      if (response.status === 'success' && response.token && response.user) {
        apiClient.setAuthToken(response.token);
        setUser(response.user);
        return;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      apiClient.removeAuthToken();
      setUser(null);
      router.push('/auth/login');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { requireAuth?: boolean; requireAdmin?: boolean; redirectTo?: string } = {}
) {
  const { requireAuth = true, requireAdmin = false, redirectTo = '/auth/login' } = options;

  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (requireAuth && !user) {
          router.push(redirectTo);
          return;
        }

        if (requireAdmin && user?.role !== 'admin') {
          router.push('/');
          toast.error('Access denied. Admin privileges required.');
          return;
        }
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (requireAuth && !user) {
      return null;
    }

    if (requireAdmin && user?.role !== 'admin') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Hook for checking auth status
export function useAuthStatus() {
  const { user, isLoading } = useAuth();
  
  return {
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    user,
  };
}
