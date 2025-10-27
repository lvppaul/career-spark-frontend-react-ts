import React from 'react';
import newsService from '@/features/user/news/services/newsService';
import type {
  CreateNewsRequest,
  CreateNewsResponse,
} from '@/features/user/news/services/newsService';

export function useCreateNews() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<CreateNewsResponse['data'] | null>(
    null
  );

  const create = React.useCallback(async (payload: CreateNewsRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await newsService.createNews(payload);
      setData(resp.data ?? null);
      return resp;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    create,
    data,
    isLoading,
    error,
  } as const;
}

export default useCreateNews;
