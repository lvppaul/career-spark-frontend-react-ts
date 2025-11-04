import React from 'react';
import { message } from 'antd';
import adminOrderService, {
  type TopSpender,
  type GetTopSpendersParams,
} from '@/features/admin/services/orderService';

/**
 * Hook to fetch top spenders for current month in admin dashboard
 */
export function useTopSpenders(initialParams?: GetTopSpendersParams) {
  const [data, setData] = React.useState<TopSpender[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [params, setParams] = React.useState<GetTopSpendersParams>(
    initialParams || {
      top: 10,
    }
  );

  const fetch = React.useCallback(
    async (fetchParams?: GetTopSpendersParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = fetchParams || params;
        const resp =
          await adminOrderService.getTopSpendersCurrentMonth(queryParams);
        if (resp.success) {
          setData(resp.data || []);
        } else {
          throw new Error(resp.message || 'Failed to fetch top spenders');
        }
      } catch (err) {
        console.error('Failed to fetch top spenders', err);
        setError(err as Error);
        message.error('Không thể tải dữ liệu top người chi tiêu');
      } finally {
        setIsLoading(false);
      }
    },
    [params]
  );

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = React.useCallback(() => {
    fetch(params);
  }, [fetch, params]);

  const updateParams = React.useCallback(
    (newParams: Partial<GetTopSpendersParams>) => {
      setParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  return {
    data,
    isLoading,
    error,
    params,
    updateParams,
    refetch,
    fetch,
  } as const;
}

export default useTopSpenders;
