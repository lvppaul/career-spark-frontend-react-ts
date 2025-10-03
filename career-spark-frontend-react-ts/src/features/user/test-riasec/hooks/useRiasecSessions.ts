import { useCallback, useEffect, useState } from 'react';
import service from '../services/testRiasecService';
import type { SessionList } from '../types';

export function useRiasecSessions(userId?: number) {
  const [data, setData] = useState<SessionList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (userId == null) return;
    setIsLoading(true);
    setError(null);
    try {
      const sessions = await service.getSessionsByUser(userId);
      setData(sessions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refresh: fetch } as const;
}

export default useRiasecSessions;
