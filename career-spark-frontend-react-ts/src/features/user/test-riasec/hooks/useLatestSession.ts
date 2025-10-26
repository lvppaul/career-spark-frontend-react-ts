import { useCallback, useEffect, useState } from 'react';
import service from '../services/testRiasecService';
import type { SessionSummary } from '../types';

export function useLatestSession() {
  const [data, setData] = useState<SessionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const latest = await service.getLatestSession();
      setData(latest);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refresh: fetch } as const;
}

export default useLatestSession;
