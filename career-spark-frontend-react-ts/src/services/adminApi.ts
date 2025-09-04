import api from '../lib/axios';
import type {
  User,
  RiasecQuestion,
  AdminStats,
  UserFilters,
  QuestionFilters,
  PaginationResponse,
} from '../types/admin';

// User Management APIs
export const userApi = {
  // Get all users with pagination and filters
  getUsers: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters?: UserFilters
  ): Promise<PaginationResponse<User>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(filters?.role && { role: filters.role }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.subscription && { subscription: filters.subscription }),
    });
    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (
    userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>
  ): Promise<User> => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  // Update user status
  updateUserStatus: async (
    id: string,
    status: 'active' | 'inactive' | 'banned'
  ): Promise<User> => {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  // Reset user password
  resetPassword: async (id: string): Promise<{ tempPassword: string }> => {
    const response = await api.post(`/admin/users/${id}/reset-password`);
    return response.data;
  },
};

// Question Management APIs
export const questionApi = {
  // Get all questions with pagination and filters
  getQuestions: async (
    page: number = 1,
    limit: number = 10,
    filters?: QuestionFilters
  ): Promise<PaginationResponse<RiasecQuestion>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.isActive !== undefined && {
        isActive: filters.isActive.toString(),
      }),
    });
    const response = await api.get(`/admin/questions?${params}`);
    return response.data;
  },

  // Get question by ID
  getQuestionById: async (id: string): Promise<RiasecQuestion> => {
    const response = await api.get(`/admin/questions/${id}`);
    return response.data;
  },

  // Create question
  createQuestion: async (
    questionData: Omit<RiasecQuestion, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RiasecQuestion> => {
    const response = await api.post('/admin/questions', questionData);
    return response.data;
  },

  // Update question
  updateQuestion: async (
    id: string,
    questionData: Partial<RiasecQuestion>
  ): Promise<RiasecQuestion> => {
    const response = await api.put(`/admin/questions/${id}`, questionData);
    return response.data;
  },

  // Delete question
  deleteQuestion: async (id: string): Promise<void> => {
    await api.delete(`/admin/questions/${id}`);
  },

  // Toggle question status
  toggleQuestionStatus: async (
    id: string,
    isActive: boolean
  ): Promise<RiasecQuestion> => {
    const response = await api.patch(`/admin/questions/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  // Reorder questions
  reorderQuestions: async (questionIds: string[]): Promise<void> => {
    await api.patch('/admin/questions/reorder', { questionIds });
  },

  // Bulk import questions
  importQuestions: async (
    questions: Omit<RiasecQuestion, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<RiasecQuestion[]> => {
    const response = await api.post('/admin/questions/bulk-import', {
      questions,
    });
    return response.data;
  },
};

// Admin Dashboard APIs
export const adminApi = {
  // Get dashboard stats
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit: number = 10) => {
    const response = await api.get(`/admin/activities?limit=${limit}`);
    return response.data;
  },

  // Export users data
  exportUsers: async (filters?: UserFilters): Promise<Blob> => {
    const params = new URLSearchParams({
      ...(filters?.role && { role: filters.role }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.subscription && { subscription: filters.subscription }),
    });
    const response = await api.get(`/admin/users/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Export questions data
  exportQuestions: async (filters?: QuestionFilters): Promise<Blob> => {
    const params = new URLSearchParams({
      ...(filters?.category && { category: filters.category }),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.isActive !== undefined && {
        isActive: filters.isActive.toString(),
      }),
    });
    const response = await api.get(`/admin/questions/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
