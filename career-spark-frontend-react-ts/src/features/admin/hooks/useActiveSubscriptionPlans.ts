import React from 'react';
import { message } from 'antd';
import adminSubscriptionPlanService from '@/features/admin/services/subscriptionPlanService';
import type { SubscriptionPlan } from '@/features/subscription/services/subscriptionPlanService';

/**
 * Hook to fetch and manage active subscription plans for admin
 */
export function useActiveSubscriptionPlans() {
  const [data, setData] = React.useState<SubscriptionPlan[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetch = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await adminSubscriptionPlanService.getActivePlans();
      if (resp.success) {
        setData(resp.data || []);
      } else {
        throw new Error(
          resp.message || 'Failed to fetch active subscription plans'
        );
      }
    } catch (err) {
      console.error('Failed to fetch active subscription plans', err);
      setError(err as Error);
      message.error('Không thể tải danh sách gói đăng ký đang hoạt động');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  } as const;
}

export default useActiveSubscriptionPlans;
