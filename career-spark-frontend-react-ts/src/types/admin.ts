export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  subscription?: {
    type: 'free' | 'premium' | 'pro';
    expiresAt?: string;
  };
}

export interface RiasecQuestion {
  id: string;
  questionText: string;
  category:
    | 'realistic'
    | 'investigative'
    | 'artistic'
    | 'social'
    | 'enterprising'
    | 'conventional';
  type: 'scale' | 'boolean';
  weight: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalQuestions: number;
  activeQuestions: number;
  testsCompleted: number;
  premiumUsers: number;
  todaySignups: number;
}

export interface UserFilters {
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive' | 'banned';
  subscription?: 'free' | 'premium' | 'pro';
}

export interface QuestionFilters {
  category?: string;
  type?: 'scale' | 'boolean';
  isActive?: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
