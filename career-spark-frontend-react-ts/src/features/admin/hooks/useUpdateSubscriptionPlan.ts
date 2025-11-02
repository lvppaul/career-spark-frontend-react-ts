import React from 'react';
import { message } from 'antd';
import adminSubscriptionPlanService from '@/features/admin/services/subscriptionPlanService';
import type { UpdateSubscriptionPlanPayload } from '@/features/admin/services/subscriptionPlanService';

/**
 * Hook to update an existing subscription plan
 */
export function useUpdateSubscriptionPlan() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const updatePlan = React.useCallback(
    async (id: number | string, payload: UpdateSubscriptionPlanPayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await adminSubscriptionPlanService.updatePlan(id, payload);
        if (resp.success) {
          message.success(resp.message || 'Cập nhật gói đăng ký thành công');
          return resp.data;
        } else {
          throw new Error(resp.message || 'Failed to update subscription plan');
        }
      } catch (err) {
        console.error('Failed to update subscription plan', err);
        setError(err as Error);
        message.error('Không thể cập nhật gói đăng ký');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    updatePlan,
    isLoading,
    error,
  } as const;
}

export default useUpdateSubscriptionPlan;
