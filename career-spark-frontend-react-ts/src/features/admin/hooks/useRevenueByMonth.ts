import React from 'react';
import { message } from 'antd';
import adminOrderService, {
  type RevenueByMonth,
  type GetRevenueByMonthParams,
} from '@/features/admin/services/orderService';

/**
 * Hook to fetch revenue by month for admin dashboard
 */
export function useRevenueByMonth(initialParams?: GetRevenueByMonthParams) {
  const [data, setData] = React.useState<RevenueByMonth[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [params, setParams] = React.useState<GetRevenueByMonthParams>(
    initialParams || {
      year: new Date().getFullYear(),
    }
  );

  const fetch = React.useCallback(
    async (fetchParams?: GetRevenueByMonthParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = fetchParams || params;
        const resp = await adminOrderService.getRevenueByMonth(queryParams);
        if (resp.success) {
          setData(resp.data || []);
        } else {
          throw new Error(resp.message || 'Failed to fetch revenue by month');
        }
      } catch (err) {
        console.error('Failed to fetch revenue by month', err);
        setError(err as Error);
        message.error('Không thể tải dữ liệu doanh thu theo tháng');
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
    (newParams: Partial<GetRevenueByMonthParams>) => {
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

export default useRevenueByMonth;
