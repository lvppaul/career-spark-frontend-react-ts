import React from 'react';
import { message } from 'antd';
import adminOrderService, {
  type RevenueByYear,
} from '@/features/admin/services/orderService';

/**
 * Hook to fetch revenue by year for admin dashboard
 */
export function useRevenueByYear() {
  const [data, setData] = React.useState<RevenueByYear[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetch = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await adminOrderService.getRevenueByYear();
      if (resp.success) {
        setData(resp.data || []);
      } else {
        throw new Error(resp.message || 'Failed to fetch revenue by year');
      }
    } catch (err) {
      console.error('Failed to fetch revenue by year', err);
      setError(err as Error);
      message.error('Không thể tải dữ liệu doanh thu theo năm');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = React.useCallback(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
    fetch,
  } as const;
}

export default useRevenueByYear;
