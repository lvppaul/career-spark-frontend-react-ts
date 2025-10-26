import api from '@/lib/axios';

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  // Optional human-readable benefits description returned by API
  benefits?: string;
  level: number;
  durationDays: number;
  description?: string;
}

export interface SubscriptionPlansResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan[];
  count?: number;
  timestamp?: string;
}

/**
 * Fetch all subscription plans
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlansResponse> {
  const resp = await api.get<SubscriptionPlansResponse>('/SubscriptionPlan');
  return resp.data;
}

export const subscriptionPlanService = {
  getSubscriptionPlans,
};

export default subscriptionPlanService;
