import { useState, useCallback } from 'react';
import type { TestSession } from '../types';
import service from '../services/testRiasecService';

export function useStartRiasecTest() {
  const [data, setData] = useState<TestSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const start = useCallback(async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await service.startTest(userId);
      setData(resp);
      return resp;
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, start } as const;
}

export default useStartRiasecTest;
