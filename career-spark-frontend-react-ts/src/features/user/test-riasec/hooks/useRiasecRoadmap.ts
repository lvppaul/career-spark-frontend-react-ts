import { useEffect, useState } from 'react';
import { getRoadmap } from '../services/testRiasecService';
import type { RoadmapResponse } from '../types';

export function useRiasecRoadmap(sessionId?: number, userId?: number) {
  const [data, setData] = useState<RoadmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId || !userId) return;

    let mounted = true;
    setIsLoading(true);
    setError(null);

    getRoadmap(sessionId, userId)
      .then((res) => {
        if (!mounted) return;
        setData(res);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [sessionId, userId]);

  return { data, isLoading, error };
}
