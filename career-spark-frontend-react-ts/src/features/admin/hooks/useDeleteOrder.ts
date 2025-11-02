import React from 'react';
import { message } from 'antd';
import adminOrderService from '@/features/admin/services/orderService';

/**
 * Hook to delete/cancel an order
 */
export function useDeleteOrder() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const deleteOrder = React.useCallback(async (orderId: number | string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await adminOrderService.deleteOrder(orderId);
      if (resp.success) {
        message.success(resp.message || 'Xóa đơn hàng thành công');
        return true;
      } else {
        throw new Error(resp.message || 'Failed to delete order');
      }
    } catch (err) {
      console.error('Failed to delete order', err);
      setError(err as Error);
      message.error('Không thể xóa đơn hàng');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteOrder,
    isLoading,
    error,
  } as const;
}

export default useDeleteOrder;
