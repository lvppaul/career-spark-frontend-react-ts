import React from 'react';
import { message } from 'antd';
import adminOrderService, {
  type RevenueByDay,
  type GetRevenueByDayParams,
} from '@/features/admin/services/orderService';

/**
 * Hook to fetch revenue by day for admin dashboard
 */
export function useRevenueByDay(initialParams?: GetRevenueByDayParams) {
  const [data, setData] = React.useState<RevenueByDay[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [params, setParams] = React.useState<GetRevenueByDayParams>(
    initialParams || {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    }
  );

  const fetch = React.useCallback(
    async (fetchParams?: GetRevenueByDayParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = fetchParams || params;
        const resp = await adminOrderService.getRevenueByDay(queryParams);
        if (resp.success) {
          setData(resp.data || []);
        } else {
          throw new Error(resp.message || 'Failed to fetch revenue by day');
        }
      } catch (err) {
        console.error('Failed to fetch revenue by day', err);
        setError(err as Error);
        message.error('Không thể tải dữ liệu doanh thu theo ngày');
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
    (newParams: Partial<GetRevenueByDayParams>) => {
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

export default useRevenueByDay;
