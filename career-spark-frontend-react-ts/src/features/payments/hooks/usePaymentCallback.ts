import React from 'react';
import paymentService from '@/features/payments/services/paymentService';
import type { VnPayCallbackResponse } from '@/features/payments/services/paymentService';

export function usePaymentCallback() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [result, setResult] = React.useState<VnPayCallbackResponse | null>(
    null
  );

  const call = React.useCallback(async (linkResponse: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await paymentService.paymentCallbackVnpay(linkResponse);
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
    call,
    isLoading,
    error,
    result,
  } as const;
}

export default usePaymentCallback;
