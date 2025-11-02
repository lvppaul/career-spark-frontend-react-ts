import React from 'react';
import { message } from 'antd';
import adminOrderService from '@/features/admin/services/orderService';

/**
 * Hook to update order status
 */
export function useUpdateOrderStatus() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const updateStatus = React.useCallback(
    async (orderId: number | string, status: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await adminOrderService.updateOrderStatus(orderId, status);
        if (resp.success) {
          message.success(
            resp.message || 'Cập nhật trạng thái đơn hàng thành công'
          );
          return resp.data;
        } else {
          throw new Error(resp.message || 'Failed to update order status');
        }
      } catch (err) {
        console.error('Failed to update order status', err);
        setError(err as Error);
        message.error('Không thể cập nhật trạng thái đơn hàng');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    updateStatus,
    isLoading,
    error,
  } as const;
}

export default useUpdateOrderStatus;
