import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '@/lib/store';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  clearError,
  clearAuth,
} from '../store/authSlice';
import { tokenUtils } from '@/utils/tokenUtils';
import type {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
} from '../type';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    user,
    accessToken,
    refreshToken: token,
    isAuthenticated,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.auth);

  // Actions
  const register = async (registerData: RegisterRequest) => {
    const result = await dispatch(registerUser(registerData));
    if (registerUser.fulfilled.match(result)) {
      navigate('/'); // Redirect after successful registration
    }
    return result;
  };

  const login = async (loginData: LoginRequest) => {
    const result = await dispatch(loginUser(loginData));
    if (loginUser.fulfilled.match(result)) {
      navigate('/'); // Redirect after successful login
    }
    return result;
  };

  const logout = async (logoutData?: LogoutRequest) => {
    const result = await dispatch(logoutUser(logoutData));
    if (logoutUser.fulfilled.match(result)) {
      navigate('/auth/login'); // Redirect to login after logout
    }
    return result;
  };

  const refresh = async (refreshTokenData?: RefreshTokenRequest) => {
    return dispatch(refreshToken(refreshTokenData));
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const forceLogout = () => {
    dispatch(clearAuth());
    navigate('/auth/login');
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
    accessToken,
    refreshToken: token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    register,
    login,
    logout,
    refresh,
    clearAuthError,
    forceLogout,

    // Utilities
    getCurrentUser,
    getUserRole,
    hasRole,
    isAdmin,
    isUser,
  };
};
