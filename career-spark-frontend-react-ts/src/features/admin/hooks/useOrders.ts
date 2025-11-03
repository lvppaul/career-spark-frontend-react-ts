import React from 'react';
import { message } from 'antd';
import adminOrderService, {
  type AdminOrderData,
  type PaginationMetadata,
  type GetOrdersParams,
} from '@/features/admin/services/orderService';

/**
 * Hook to fetch and manage orders for admin
 */
export function useOrders(initialParams?: GetOrdersParams) {
  const [data, setData] = React.useState<AdminOrderData[] | null>(null);
  const [pagination, setPagination] = React.useState<PaginationMetadata | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [params, setParams] = React.useState<GetOrdersParams>(
    initialParams || { pageNumber: 1, pageSize: 10 }
  );

  const fetch = React.useCallback(
    async (fetchParams?: GetOrdersParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = fetchParams || params;
        const resp = await adminOrderService.getOrders(queryParams);
        if (resp.success) {
          setData(resp.data || []);
          setPagination(resp.pagination);
        } else {
          throw new Error(resp.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setError(err as Error);
        message.error('Không thể tải danh sách đơn hàng');
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
    (newParams: Partial<GetOrdersParams>) => {
      setParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  return {
    data,
    pagination,
    isLoading,
    error,
    params,
    updateParams,
    refetch,
    fetch,
  } as const;
}

export default useOrders;
