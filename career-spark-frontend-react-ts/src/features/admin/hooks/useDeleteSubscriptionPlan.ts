import React from 'react';
import { message } from 'antd';
import adminSubscriptionPlanService from '@/features/admin/services/subscriptionPlanService';

/**
 * Hook to delete a subscription plan
 */
export function useDeleteSubscriptionPlan() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const deletePlan = React.useCallback(async (id: number | string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await adminSubscriptionPlanService.deletePlan(id);
      if (resp.success) {
        message.success(resp.message || 'Xóa gói đăng ký thành công');
        return true;
      } else {
        throw new Error(resp.message || 'Failed to delete subscription plan');
      }
    } catch (err) {
      console.error('Failed to delete subscription plan', err);
      setError(err as Error);
      message.error('Không thể xóa gói đăng ký');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deletePlan,
    isLoading,
    error,
  } as const;
}

export default useDeleteSubscriptionPlan;
