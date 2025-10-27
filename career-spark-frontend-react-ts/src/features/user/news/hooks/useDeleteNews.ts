import React from 'react';
import newsService from '@/features/user/news/services/newsService';
import type { DeleteNewsResponse } from '@/features/user/news/services/newsService';

export function useDeleteNews() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<DeleteNewsResponse | null>(null);

  const remove = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await newsService.deleteNews(id);
      setData(resp ?? null);
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
    remove,
    data,
    isLoading,
    error,
  } as const;
}

export default useDeleteNews;
