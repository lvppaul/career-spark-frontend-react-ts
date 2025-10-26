import React from 'react';
import userSubscriptionService from '@/features/subscription/services/userSubscriptionService';
import type {
  ActiveSubscription,
  MyActiveSubscriptionResponse,
} from '@/features/subscription/services/userSubscriptionService';

export function useMyActiveSubscription() {
  const [data, setData] = React.useState<ActiveSubscription | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetch = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp: MyActiveSubscriptionResponse =
        await userSubscriptionService.getMyActiveSubscription();

      if (resp.success && resp.data) {
        setData(resp.data);
      } else {
        setData(null);
      }

      return resp;
    } catch (err) {
      console.error('Failed to fetch active subscription', err);
      setError(err as Error);
      setData(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetch().catch(() => {});
  }, [fetch]);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  } as const;
}

export default useMyActiveSubscription;
