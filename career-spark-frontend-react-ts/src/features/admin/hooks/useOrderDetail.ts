import React from 'react';
import { message } from 'antd';
import adminOrderService from '@/features/admin/services/orderService';
import type { AdminOrderData } from '@/features/admin/services/orderService';

/**
 * Hook to fetch a single order by ID
 */
export function useOrderDetail(orderId?: number | string) {
  const [data, setData] = React.useState<AdminOrderData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetch = React.useCallback(
    async (id?: number | string) => {
      const targetId = id || orderId;
      if (!targetId) return;

      setIsLoading(true);
      setError(null);
      try {
        const resp = await adminOrderService.getOrderById(targetId);
        if (resp.success) {
          setData(resp.data);
        } else {
          throw new Error(resp.message || 'Failed to fetch order detail');
        }
      } catch (err) {
        console.error('Failed to fetch order detail', err);
        setError(err as Error);
        message.error('Không thể tải chi tiết đơn hàng');
      } finally {
        setIsLoading(false);
      }
    },
    [orderId]
  );

  React.useEffect(() => {
    if (orderId) {
      fetch();
    }
  }, [orderId, fetch]);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  } as const;
}

export default useOrderDetail;
