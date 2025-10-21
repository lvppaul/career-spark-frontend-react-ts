// Types for User Management feature
export interface UserDTO {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string; // ISO datetime
  isActive: boolean;
  avatarURL?: string | null;
  role?: string;
}

// Backend wrapper response for get user by id
export interface GetUserByIdResponse {
  success: boolean;
  message?: string;
  payload?: UserDTO;
  timestamp?: string;
}

export type { UserDTO as User };

// Forgot Password API response
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

// Reset Password API
export interface ResetPasswordRequest {
  email: string;
  token: string; // token from email link
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

// Update password when authenticated
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}
