import api from '@/lib/axios';

export interface ActiveSubscription {
  id: number;
  userId: number;
  planId: number;
  planName: string;
  planPrice: number;
  planDurationDays: number;
  level: number;
  benefits?: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  isActive: boolean;
  isExpired: boolean;
  remainingDays: number;
}

export interface MyActiveSubscriptionResponse {
  success: boolean;
  message: string;
  data?: ActiveSubscription;
  timestamp?: string;
}

export async function getMyActiveSubscription(): Promise<MyActiveSubscriptionResponse> {
  const resp = await api.get<MyActiveSubscriptionResponse>(
    '/UserSubscription/my-active-subscription'
  );
  return resp.data;
}

export const userSubscriptionService = {
  getMyActiveSubscription,
};

export default userSubscriptionService;
