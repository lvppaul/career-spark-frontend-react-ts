import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { tokenUtils } from '@/utils/tokenUtils';
import { getDefaultRouteByRole } from '@/router/constants';
import type { User, LoginRequest, RegisterRequest } from '../type';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  forceLogout: () => void;
  getCurrentUser: () => User | null;
  getUserRole: () => string | null;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    authService.isAuthenticated()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribe(() => {
      setUser(authService.getCurrentUser());
      setIsAuthenticated(authService.isAuthenticated());
    });

    return unsubscribe;
  }, []);

  // Handle pending redirect after auth state update
  useEffect(() => {
    if (pendingRedirect && isAuthenticated && !isLoading) {
      console.log('Executing pending redirect to:', pendingRedirect);
      navigate(pendingRedirect, { replace: true });
      setPendingRedirect(null);
    }
  }, [pendingRedirect, isAuthenticated, isLoading, navigate]);

  const login = async (loginData: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Login attempt started...');
      await authService.login(loginData);
      console.log('Auth service login completed');

      // Get user role and prepare redirect path
      const userRole = tokenUtils.getUserRole();
      console.log('User role after login:', userRole);

      const redirectPath = getDefaultRouteByRole(userRole);
      console.log('Setting pending redirect to:', redirectPath);

      // Set pending redirect - the useEffect will handle navigation when auth state is updated
      setPendingRedirect(redirectPath);
    } catch (err) {
      console.error('Login error in useAuth:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.register(registerData);

      // Get user role and prepare redirect path
      const userRole = tokenUtils.getUserRole();
      const redirectPath = getDefaultRouteByRole(userRole);

      // Set pending redirect - the useEffect will handle navigation when auth state is updated
      setPendingRedirect(redirectPath);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('useAuth: Logout attempt started...');
      await authService.logout();
      console.log('useAuth: Logout API call completed');

      // Force clear local auth state
      setUser(null);
      setIsAuthenticated(false);

      console.log('useAuth: Auth state cleared, attempting navigation...');

      // Force immediate page redirect instead of relying on React Router
      console.log(
        'useAuth: Using window.location.replace for immediate redirect'
      );
      window.location.replace('/login');

      console.log('useAuth: Navigation commands executed');
    } catch (err) {
      console.error('useAuth: Logout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);

      // Even if logout API fails, still clear local state and redirect
      setUser(null);
      setIsAuthenticated(false);

      // Force redirect
      window.location.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const forceLogout = async (): Promise<void> => {
    console.log('useAuth: Force logout called');

    try {
      // Try to call logout API
      console.log('useAuth: Attempting logout API call...');
      await authService.logout();
      console.log('useAuth: Logout API call completed successfully');
    } catch (error) {
      console.warn(
        'Force logout: API call failed, continuing with local logout',
        error
      );
    }

    // Clear local state regardless of API call result
    console.log('useAuth: Clearing local auth state...');
    authService.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    console.log('useAuth: Auth state cleared');

    // Force page redirect
    console.log('useAuth: Redirecting to /login...');
    window.location.replace('/login');
  };

  // Utility functions using tokenUtils
  const getCurrentUser = () => user;
  const getUserRole = () => tokenUtils.getUserRole();
  const hasRole = (role: string) => tokenUtils.hasRole(role);
  const isAdmin = () => tokenUtils.isAdmin();
  const isUser = () => tokenUtils.isUser();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    clearError,
    forceLogout,

    // Utilities
    getCurrentUser,
    getUserRole,
    hasRole,
    isAdmin,
    isUser,
  };
};
