import api from '../../../lib/axios';
import { tokenUtils } from '../../../utils/tokenUtils';
import type {
  AuthResponse,
  LoginRequest,
  GoogleLoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  LogoutRequest,
  User,
} from '../type';

class AuthService {
  private listeners: Array<() => void> = [];

  // Subscribe to auth state changes
  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  // Notify all listeners about auth state changes
  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    return tokenUtils.getUserData();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return tokenUtils.isAuthenticated();
  }

  // Get access token
  getAccessToken(): string | null {
    return tokenUtils.getAccessToken();
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return tokenUtils.getRefreshToken();
  }

  // Register user
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        'Authentication/register',
        registerData
      );

      const data = response.data;

      // Handle both response structures: nested data or direct properties
      const accessToken = data.data?.accessToken || data.accessToken;
      const refreshToken = data.data?.refreshToken || data.refreshToken;

      if (data.success && accessToken && refreshToken) {
        // Store tokens
        tokenUtils.setTokens(accessToken, refreshToken);

        // Decode and store user data
        const userData = tokenUtils.decodeToken(accessToken);
        if (userData) {
          tokenUtils.setUserData(userData);
        }

        // Notify listeners about auth state change
        this.notifyListeners();
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
          throw new Error(errorMessage);
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed';
      throw new Error(errorMessage);
    }
  }

  // Login user
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        'Authentication/login',
        loginData
      );

      const data = response.data;
      console.log('Login response data:', data);

      // Handle both response structures: nested data or direct properties
      const accessToken = data.data?.accessToken || data.accessToken;
      const refreshToken = data.data?.refreshToken || data.refreshToken;

      if (data.success && accessToken && refreshToken) {
        console.log('Login successful, storing tokens...');
        // Store tokens
        tokenUtils.setTokens(accessToken, refreshToken);

        // Decode and store user data
        const userData = tokenUtils.decodeToken(accessToken);
        console.log('Decoded user data:', userData);
        if (userData) {
          tokenUtils.setUserData(userData);
        }

        // Notify listeners about auth state change
        this.notifyListeners();
        console.log('Auth listeners notified');
      } else {
        console.log('Login response indicates failure:', data);
        console.log('Access token:', accessToken);
        console.log('Refresh token:', refreshToken);
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
          throw new Error(errorMessage);
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      throw new Error(errorMessage);
    }
  }

  // Google Login
  async loginWithGoogle(googleData: GoogleLoginRequest): Promise<AuthResponse> {
    try {
      console.log('Google login request:', googleData);

      const response = await api.post<AuthResponse>(
        'Authentication/login-google',
        googleData
      );

      const data = response.data;
      console.log('Google login response data:', data);

      // Handle both response structures: nested data or direct properties
      const accessToken = data.data?.accessToken || data.accessToken;
      const refreshToken = data.data?.refreshToken || data.refreshToken;

      if (data.success && accessToken && refreshToken) {
        console.log('Google login successful, storing tokens...');
        // Store tokens
        tokenUtils.setTokens(accessToken, refreshToken);

        // Decode and store user data
        const userData = tokenUtils.decodeToken(accessToken);
        console.log('Decoded user data from Google login:', userData);
        if (userData) {
          tokenUtils.setUserData(userData);
        }

        // Notify listeners about auth state change
        this.notifyListeners();
        console.log('Google auth listeners notified');
      } else {
        console.log('Google login response indicates failure:', data);
        console.log('Access token:', accessToken);
        console.log('Refresh token:', refreshToken);
      }

      return data;
    } catch (error: unknown) {
      console.error('Google login error:', error);

      // Handle axios error response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response: { data: { message?: string; errors?: string[] } };
        };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          const errorMessage =
            errorData.message || errorData.errors?.[0] || 'Google login failed';
          throw new Error(errorMessage);
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Google login failed';
      throw new Error(errorMessage);
    }
  }

  // Refresh token
  async refreshToken(
    refreshTokenData?: RefreshTokenRequest
  ): Promise<AuthResponse> {
    try {
      const refreshToken =
        refreshTokenData?.refreshToken || tokenUtils.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<AuthResponse>(
        'Authentication/refreshToken',
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

        // Notify listeners about auth state change
        this.notifyListeners();
      }

      return data;
    } catch (error: unknown) {
      console.error('Refresh token error:', error);

      // Clear tokens if refresh fails
      tokenUtils.clearAll();
      this.notifyListeners();

      // Handle axios error response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response: { data: { message?: string; errors?: string[] } };
        };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          const errorMessage =
            errorData.message ||
            errorData.errors?.[0] ||
            'Token refresh failed';
          throw new Error(errorMessage);
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Token refresh failed';
      throw new Error(errorMessage);
    }
  }

  // Logout user
  async logout(logoutData?: LogoutRequest): Promise<AuthResponse> {
    try {
      const accessToken =
        logoutData?.accessToken || tokenUtils.getAccessToken();
      const refreshToken =
        logoutData?.refreshToken || tokenUtils.getRefreshToken();

      console.log(
        'Logout API call started with tokens:',
        'accessToken:',
        accessToken ? 'exists' : 'missing',
        'refreshToken:',
        refreshToken ? 'exists' : 'missing'
      );

      if (!accessToken || !refreshToken) {
        console.log('Missing tokens, clearing local storage only');
        // If no tokens, just clear local storage
        tokenUtils.clearAll();
        this.notifyListeners();
        return {
          success: true,
          message: 'Logged out successfully (local only)',
        } as AuthResponse;
      }

      const requestBody = {
        accessToken,
        refreshToken,
      };

      console.log('Logout request body:', requestBody);

      const response = await api.post<AuthResponse>(
        'Authentication/logout',
        requestBody
      );

      console.log('Logout API response:', response.data);

      // Clear local storage regardless of API response
      tokenUtils.clearAll();
      this.notifyListeners();
      console.log('Local storage cleared and listeners notified');

      return response.data;
    } catch (error: unknown) {
      console.error('Logout API error:', error);

      // Clear tokens even if logout API fails
      tokenUtils.clearAll();
      this.notifyListeners();
      console.log('Local storage cleared despite API error');

      // Return success since local cleanup succeeded
      return {
        success: true,
        message: 'Logged out successfully (local cleanup)',
      } as AuthResponse;
    }
  }

  // Clear authentication data
  clearAuth(): void {
    tokenUtils.clearAll();
    this.notifyListeners();
  }

  // Update stored user data and notify subscribers
  updateLocalUser(user: User): void {
    try {
      tokenUtils.setUserData(user);
      this.notifyListeners();
    } catch (err) {
      console.warn('Failed to update local user data', err);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
