import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../../lib/axios';
import type {
  AuthState,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  LogoutRequest,
  User,
} from '../type';
import { tokenUtils } from '@/utils/tokenUtils';

// Async thunks for API calls
export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>('auth/register', async (registerData, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthResponse>(
      'Authentication/register', // ✅ Sửa: loại bỏ /api prefix
      registerData
    );

    const data = response.data;

    if (data.success && data.accessToken && data.refreshToken) {
      // Store tokens
      tokenUtils.setTokens(data.accessToken, data.refreshToken);

      // Decode and store user data
      const userData = tokenUtils.decodeToken(data.accessToken);
      if (userData) {
        tokenUtils.setUserData(userData);
      }
    }

    return data;
  } catch (error: unknown) {
    console.error('Register error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response: { data: { message?: string; errors?: string[] } };
      };
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        const errorMessage =
          errorData.message || errorData.errors?.[0] || 'Registration failed';
        return rejectWithValue(errorMessage);
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Registration failed';
    return rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>('auth/login', async (loginData, { rejectWithValue }) => {
  try {
    const response = await api.post<AuthResponse>(
      'Authentication/login', // ✅ Sửa: loại bỏ /api prefix
      loginData
    );

    const data = response.data;

    if (data.success && data.accessToken && data.refreshToken) {
      // Store tokens
      tokenUtils.setTokens(data.accessToken, data.refreshToken);

      // Decode and store user data
      const userData = tokenUtils.decodeToken(data.accessToken);
      if (userData) {
        tokenUtils.setUserData(userData);
      }
    }

    return data;
  } catch (error: unknown) {
    console.error('Login error:', error);

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response: { data: { message?: string; errors?: string[] } };
      };
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        const errorMessage =
          errorData.message || errorData.errors?.[0] || 'Login failed';
        return rejectWithValue(errorMessage);
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Login failed';
    return rejectWithValue(errorMessage);
  }
});

export const refreshToken = createAsyncThunk<
  AuthResponse,
  RefreshTokenRequest | undefined,
  { rejectValue: string }
>('auth/refreshToken', async (refreshTokenData, { rejectWithValue }) => {
  try {
    const refreshToken =
      refreshTokenData?.refreshToken || tokenUtils.getRefreshToken();

    if (!refreshToken) {
      return rejectWithValue('No refresh token available');
    }

    const response = await api.post<AuthResponse>(
      'Authentication/refreshToken', // ✅ Sửa: loại bỏ /api prefix
      { refreshToken }
    );

    const data = response.data;

    if (data.success && data.accessToken && data.refreshToken) {
      // Store new tokens
      tokenUtils.setTokens(data.accessToken, data.refreshToken);

      // Decode and store updated user data
      const userData = tokenUtils.decodeToken(data.accessToken);
      if (userData) {
        tokenUtils.setUserData(userData);
      }
    }

    return data;
  } catch (error: unknown) {
    console.error('Refresh token error:', error);

    // Clear tokens if refresh fails
    tokenUtils.clearAll();

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response: { data: { message?: string; errors?: string[] } };
      };
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        const errorMessage =
          errorData.message || errorData.errors?.[0] || 'Token refresh failed';
        return rejectWithValue(errorMessage);
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Token refresh failed';
    return rejectWithValue(errorMessage);
  }
});

export const logoutUser = createAsyncThunk<
  AuthResponse,
  LogoutRequest | undefined,
  { rejectValue: string }
>('auth/logout', async (logoutData) => {
  try {
    const refreshToken =
      logoutData?.refreshToken || tokenUtils.getRefreshToken();

    if (!refreshToken) {
      // If no refresh token, just clear local storage
      tokenUtils.clearAll();
      return {
        success: true,
        accessToken: null,
        refreshToken: null,
        message: 'Logged out successfully',
        errors: null,
      };
    }

    const response = await api.post<AuthResponse>(
      'Authentication/logout', // ✅ Sửa: loại bỏ /api prefix
      { refreshToken }
    );

    // Clear local storage regardless of API response
    tokenUtils.clearAll();

    return response.data;
  } catch (error: unknown) {
    console.error('Logout error:', error);

    // Clear tokens even if logout API fails
    tokenUtils.clearAll();

    // Return success since local cleanup succeeded
    return {
      success: true,
      accessToken: null,
      refreshToken: null,
      message: 'Logged out successfully',
      errors: null,
    };
  }
});

// Initial state
const initialState: AuthState = {
  user: tokenUtils.getUserData(),
  accessToken: tokenUtils.getAccessToken(),
  refreshToken: tokenUtils.getRefreshToken(),
  isAuthenticated: tokenUtils.isAuthenticated(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manual actions for direct state updates
    clearError: (state) => {
      state.error = null;
    },
    setAuthData: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      tokenUtils.clearAll();
    },
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { accessToken, refreshToken } = action.payload;
        if (accessToken && refreshToken) {
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.user = tokenUtils.getUserData();
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
        state.isAuthenticated = false;
      })

      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { accessToken, refreshToken } = action.payload;
        if (accessToken && refreshToken) {
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.user = tokenUtils.getUserData();
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      })

      // Refresh token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        const { accessToken, refreshToken: newRefreshToken } = action.payload;
        if (accessToken && newRefreshToken) {
          state.accessToken = accessToken;
          state.refreshToken = newRefreshToken;
          state.user = tokenUtils.getUserData();
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Token refresh failed';
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // Logout user
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        // Even if logout API fails, clear local state
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setAuthData, clearAuth } = authSlice.actions;
export default authSlice.reducer;
