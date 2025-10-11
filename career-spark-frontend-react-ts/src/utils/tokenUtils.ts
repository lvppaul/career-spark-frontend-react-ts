import type { User } from '@/features/auth/type';
import { TOKEN_KEYS } from '@/features/auth/type';

// Token management utilities
export const tokenUtils = {
  // Get tokens from localStorage
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  },

  getUserData: (): User | null => {
    const userData = localStorage.getItem(TOKEN_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  // Store tokens in localStorage
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken);
  },

  setUserData: (user: User): void => {
    localStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(user));
  },

  // Clear all tokens and user data
  clearAll: (): void => {
    // Remove all items from localStorage to ensure complete cleanup on logout
    // This will remove tokens, user data and any other persisted app data
    try {
      localStorage.clear();
    } catch {
      // Fallback: remove known token keys if clear fails
      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.USER_DATA);
    }
  },

  // Decode JWT token to get user data
  decodeToken: (token: string): User | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);

      // Map JWT claims to User interface
      return {
        sub: payload.sub,
        name: payload.name,
        email: payload.email,
        Role: payload.Role,
        avatarURL:
          payload.avatarURL ||
          payload.avatarUrl ||
          payload.picture ||
          undefined,
        aud: payload.aud,
        iss: payload.iss,
        exp: payload.exp,
        iat: payload.iat,
        nbf: payload.nbf,
      } as User;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = tokenUtils.decodeToken(token);
      if (!decoded) return true;

      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const accessToken = tokenUtils.getAccessToken();
    const refreshToken = tokenUtils.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return false;
    }

    // Check if access token is expired
    if (tokenUtils.isTokenExpired(accessToken)) {
      return false;
    }

    return true;
  },

  // Get current user role
  getUserRole: (): string | null => {
    const user = tokenUtils.getUserData();
    return user?.Role || null;
  },

  // Check if user has specific role
  hasRole: (role: string): boolean => {
    const userRole = tokenUtils.getUserRole();
    return userRole === role;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    return tokenUtils.hasRole('Admin');
  },

  // Check if user is regular user
  isUser: (): boolean => {
    return tokenUtils.hasRole('User');
  },
};
