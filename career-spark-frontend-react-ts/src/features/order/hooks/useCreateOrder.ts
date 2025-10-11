import React from 'react';
import orderService from '@/features/order/services/orderService';
import type {
  CreateOrderRequest,
  CreateOrderResponse,
} from '@/features/order/services/orderService';

export function useCreateOrder() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [result, setResult] = React.useState<CreateOrderResponse | null>(null);

  const create = React.useCallback(async (payload: CreateOrderRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await orderService.createOrder(payload);
      setResult(resp);
      return resp;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    create,
    isLoading,
    error,
    result,
  } as const;
}

export default useCreateOrder;
