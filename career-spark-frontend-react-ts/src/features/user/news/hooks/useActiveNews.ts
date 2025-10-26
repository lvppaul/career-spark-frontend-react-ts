import React from 'react';
import newsService from '@/features/user/news/services/newsService';
import type { NewsItem } from '@/features/user/news/services/newsService';

export function useActiveNews() {
  const [data, setData] = React.useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetch = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await newsService.getAllActiveNews();
      setData(resp.data || []);
    } catch (err) {
      console.error('Failed to fetch news', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  } as const;
}

export default useActiveNews;
