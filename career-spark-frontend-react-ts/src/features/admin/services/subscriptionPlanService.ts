import api from '@/lib/axios';
import type { SubscriptionPlan } from '@/features/subscription/services/subscriptionPlanService';

/**
 * API Response interface for subscription plans
 */
export interface AdminSubscriptionPlansResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan[];
  count?: number;
  timestamp?: string;
}

/**
 * API Response interface for single subscription plan operations
 */
export interface AdminSubscriptionPlanResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan;
  timestamp?: string;
}

/**
 * Payload for creating a new subscription plan
 */
export interface CreateSubscriptionPlanPayload {
  name: string;
  price: number;
  benefits?: string;
  level: number;
  durationDays: number;
  description?: string;
}

/**
 * Payload for updating an existing subscription plan
 */
export interface UpdateSubscriptionPlanPayload {
  name?: string;
  price?: number;
  benefits?: string;
  level?: number;
  durationDays?: number;
  description?: string;
}

/**
 * Admin service for managing subscription plans
 */
export const adminSubscriptionPlanService = {
  /**
   * Get all subscription plans
   */
  getAllPlans: async (options?: {
    skipLoading?: boolean;
  }): Promise<AdminSubscriptionPlansResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const resp = await api.get<AdminSubscriptionPlansResponse>(
      '/SubscriptionPlan',
      { headers }
    );
    return resp.data;
  },

  /**
   * Get all active subscription plans
   */
  getActivePlans: async (options?: {
    skipLoading?: boolean;
  }): Promise<AdminSubscriptionPlansResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const resp = await api.get<AdminSubscriptionPlansResponse>(
      '/SubscriptionPlan/active',
      { headers }
    );
    return resp.data;
  },

  /**
   * Get a single subscription plan by ID
   */
  getPlanById: async (
    id: number | string,
    options?: { skipLoading?: boolean }
  ): Promise<AdminSubscriptionPlanResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const resp = await api.get<AdminSubscriptionPlanResponse>(
      `/SubscriptionPlan/${id}`,
      { headers }
    );
    return resp.data;
  },

  /**
   * Create a new subscription plan
   */
  createPlan: async (
    payload: CreateSubscriptionPlanPayload,
    options?: { skipLoading?: boolean }
  ): Promise<AdminSubscriptionPlanResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const resp = await api.post<AdminSubscriptionPlanResponse>(
      '/SubscriptionPlan',
      payload,
      { headers }
    );
    return resp.data;
  },

  /**
   * Update an existing subscription plan
   */
  updatePlan: async (
    id: number | string,
    payload: UpdateSubscriptionPlanPayload,
    options?: { skipLoading?: boolean }
  ): Promise<AdminSubscriptionPlanResponse> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const resp = await api.put<AdminSubscriptionPlanResponse>(
      `/SubscriptionPlan/${id}`,
      payload,
      { headers }
    );
    return resp.data;
  },

  /**
   * Delete a subscription plan
   */
  deletePlan: async (
    id: number | string,
    options?: { skipLoading?: boolean }
  ): Promise<{ success: boolean; message?: string; timestamp?: string }> => {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';

    const resp = await api.delete<{
      success: boolean;
      message?: string;
      timestamp?: string;
    }>(`/SubscriptionPlan/${id}`, { headers });
    return resp.data;
  },
};

export default adminSubscriptionPlanService;
