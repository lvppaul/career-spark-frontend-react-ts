import React from 'react';
import { message } from 'antd';
import adminSubscriptionPlanService from '@/features/admin/services/subscriptionPlanService';
import type { CreateSubscriptionPlanPayload } from '@/features/admin/services/subscriptionPlanService';

/**
 * Hook to create a new subscription plan
 */
export function useCreateSubscriptionPlan() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const createPlan = React.useCallback(
    async (payload: CreateSubscriptionPlanPayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await adminSubscriptionPlanService.createPlan(payload);
        if (resp.success) {
          message.success(resp.message || 'Tạo gói đăng ký thành công');
          return resp.data;
        } else {
          throw new Error(resp.message || 'Failed to create subscription plan');
        }
      } catch (err) {
        console.error('Failed to create subscription plan', err);
        setError(err as Error);
        message.error('Không thể tạo gói đăng ký');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createPlan,
    isLoading,
    error,
  } as const;
}

export default useCreateSubscriptionPlan;
