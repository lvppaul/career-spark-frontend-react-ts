import api from '../../../lib/axios';
import axios from 'axios';
import { tokenUtils } from '../../../utils/tokenUtils';
import type {
  AuthResponse,
  LoginRequest,
  GoogleLoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  LogoutRequest,
  User,
  RegisterResponse,
  RegisterResult,
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
  async register(registerData: RegisterRequest): Promise<RegisterResult> {
    try {
      const response = await api.post<RegisterResponse>(
        'Authentication/register',
        registerData
      );
      const data = response.data;
      // Normalize to RegisterResult
      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch (error: unknown) {
      const axiosErr = error as {
        response?: { data?: { message?: string; errors?: string[] } };
        message?: string;
      };
      console.log(
        'Register error ở auth service:',
        axiosErr?.response?.data?.message || axiosErr?.message || error
      );
      const rawMessage: string =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.errors?.[0] ||
        axiosErr?.message ||
        'Registration failed';

      // Heuristics to map server message to a specific field
      const lower = rawMessage.toLowerCase();
      type FieldKey =
        | 'email'
        | 'phone'
        | 'password'
        | 'name'
        | 'confirmPassword';
      let errorField: FieldKey | undefined = undefined;
      if (lower.includes('email')) errorField = 'email';
      else if (lower.includes('phone')) errorField = 'phone';
      else if (lower.includes('password')) errorField = 'password';
      else if (lower.includes('name')) errorField = 'name';

      return {
        success: false,
        message: rawMessage,
        errorField,
      } as RegisterResult;
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

      if (data.success === false) {
        throw new Error(data.message || 'Login failed');
      }

      //  success
      const accessToken = data.data?.accessToken || data.accessToken;
      const refreshToken = data.data?.refreshToken || data.refreshToken;

      if (data.success && accessToken && refreshToken) {
        tokenUtils.setTokens(accessToken, refreshToken);
        const userData = tokenUtils.decodeToken(accessToken);
        if (userData) tokenUtils.setUserData(userData);
        this.notifyListeners();
      }

      return data;
    } catch (error: unknown) {
      console.error('Login error:', error);

      // Lấy message từ axios response nếu có
      const axiosErr = error as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      const message =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.errors?.[0] ||
        (error instanceof Error ? error.message : undefined) ||
        'Login failed';
      console.log('AuthService login error message:', message);
      throw new Error(message);
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
    const refreshToken =
      refreshTokenData?.refreshToken || tokenUtils.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const rawBase = (import.meta.env.VITE_API_URL as string) || '';
    const base = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
    const url = `${base}/Authentication/refreshToken`;

    //  Dùng axios gốc, không interceptor
    const response = await axios.post<AuthResponse>(
      url,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = response.data;
    const newAccessToken = data.data?.accessToken || data.accessToken;
    const newRefreshToken = data.data?.refreshToken || data.refreshToken;

    if (data.success && newAccessToken && newRefreshToken) {
      tokenUtils.setTokens(newAccessToken, newRefreshToken);
      const userData = tokenUtils.decodeToken(newAccessToken);
      if (userData) tokenUtils.setUserData(userData);
    }

    return data;
  }

  // Verify email (send verification email)
  async verifyEmail(
    email: string
  ): Promise<{ success: boolean; message: string; timestamp?: string }> {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        timestamp?: string;
      }>('Authentication/verify-email', { email });

      return response.data;
    } catch (error: unknown) {
      console.error('Verify email error:', error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response: { data: { message?: string; errors?: string[] } };
        };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          const errorMessage =
            errorData.message || errorData.errors?.[0] || 'Verification failed';
          throw new Error(errorMessage);
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Verification failed';
      throw new Error(errorMessage);
    }
  }

  // Confirm email (user clicks the link with token)
  async confirmEmail(
    email: string,
    token: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        'Authentication/confirm-email',
        { email, token }
      );
      return response.data;
    } catch (error: unknown) {
      console.error('Confirm email error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response: { data: { message?: string; errors?: string[] } };
        };
        if (axiosError.response?.data) {
          const errorData = axiosError.response.data;
          const errorMessage =
            errorData.message ||
            errorData.errors?.[0] ||
            'Confirm email failed';
          throw new Error(errorMessage);
        }
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Confirm email failed';
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
