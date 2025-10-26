// Types for User Management feature
export interface UserDTO {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string; // ISO datetime
  isActive: boolean;
  isVerified?: boolean;
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

// Pagination info returned by many list endpoints
export interface PaginationInfo {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Generic paginated response for users
export interface PaginatedUsersResponse {
  success: boolean;
  message?: string;
  payload: UserDTO[];
  pagination: PaginationInfo;
  timestamp?: string;
}

export type { UserDTO as User };

// Filters used by the admin user management UI
export interface UserFilters {
  role?: string;
  // Whether the user is active (true) or not (false). Undefined means no filter.
  isActive?: boolean;
  // Whether the user is verified. Undefined means no filter.
  isVerified?: boolean;
  // subscription filter removed per admin UI simplification
}

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
