// Register Request
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  roleId: number;
}

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Google Login Request
export interface GoogleLoginRequest {
  accessToken: string;
}

// Refresh Token Request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Logout Request
export interface LogoutRequest {
  accessToken: string;
  refreshToken: string;
}

// Auth Response (common for register, login, refreshToken)
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  accessToken?: string | null; // Fallback for direct structure
  refreshToken?: string | null; // Fallback for direct structure
  errors?: string[] | null;
}

// User data from JWT token
export interface User {
  sub: string; // user id
  name: string;
  email: string;
  Role: string;
  // Optional avatar URL provided in JWT payload
  avatarURL?: string;
  aud: string;
  iss: string;
  exp: number;
  iat: number;
  nbf: number;
}

// Auth State
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Token storage keys
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
} as const;

// Type aliases for useAuth hook
export type LoginCredentials = LoginRequest;
export type RegisterCredentials = RegisterRequest;
