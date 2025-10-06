import { useState, useCallback } from 'react';
import service from '../services/testRiasecService';
import type { SubmitRequest, SubmitResponse } from '../types';

export function useSubmitRiasecTest() {
  const [data, setData] = useState<SubmitResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(async (payload: SubmitRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await service.submitTest(payload);
      setData(resp);
      return resp;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, submit } as const;
}

export default useSubmitRiasecTest;
