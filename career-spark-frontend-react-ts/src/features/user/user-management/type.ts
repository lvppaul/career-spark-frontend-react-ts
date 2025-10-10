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
