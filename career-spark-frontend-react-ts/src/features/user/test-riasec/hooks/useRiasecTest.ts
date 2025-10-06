import { useCallback, useEffect, useState } from 'react';
import type { RiasecQuestion } from '../types';
import service from '../services/testRiasecService';

export function useRiasecTest() {
  const [data, setData] = useState<RiasecQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const questions = await service.getRiasecQuestions();
      setData(questions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    isLoading,
    error,
    refresh: fetch,
  } as const;
}

export default useRiasecTest;
