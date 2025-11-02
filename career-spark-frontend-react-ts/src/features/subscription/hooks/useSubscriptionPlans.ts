import React from 'react';
import subscriptionPlanService from '@/features/subscription/services/subscriptionPlanService';
import type { SubscriptionPlan } from '@/features/subscription/services/subscriptionPlanService';

export function useSubscriptionPlans() {
  const [data, setData] = React.useState<SubscriptionPlan[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetch = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await subscriptionPlanService.getActiveSubscriptionPlans();
      setData(resp.data || []);
    } catch (err) {
      console.error('Failed to fetch subscription plans', err);
      setError(err as Error);
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

export default useSubscriptionPlans;
