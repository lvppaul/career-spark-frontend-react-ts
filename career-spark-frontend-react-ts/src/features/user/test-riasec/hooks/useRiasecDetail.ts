import { useCallback, useEffect, useState } from 'react';
import service from '../services/testRiasecService';
import type { TestHistory } from '../types';

export function useRiasecHistory(sessionId?: number, userId?: number) {
  const [data, setData] = useState<TestHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (sessionId == null || userId == null) return;
    setIsLoading(true);
    setError(null);
    try {
      const detail = await service.getTestDetail(sessionId, userId);
      setData(detail);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refresh: fetch } as const;
}

export default useRiasecHistory;
