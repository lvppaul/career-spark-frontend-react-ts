import React from 'react';
import newsService from '@/features/user/news/services/newsService';
import type { NewsItem } from '@/features/user/news/services/newsService';

export function useNewsById(id?: number | null) {
  const [data, setData] = React.useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetch = React.useCallback(
    async (fetchId?: number | null) => {
      const nid = fetchId ?? id;
      if (nid == null) return;
      setIsLoading(true);
      setError(null);
      try {
        const resp = await newsService.getNewsById(nid);
        setData(resp.data ?? null);
      } catch (err) {
        console.error('Failed to fetch news by id', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  React.useEffect(() => {
    if (id != null) fetch(id);
  }, [id, fetch]);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  } as const;
}

export default useNewsById;
