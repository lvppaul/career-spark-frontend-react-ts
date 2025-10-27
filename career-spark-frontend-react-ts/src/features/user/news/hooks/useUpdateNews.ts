import React from 'react';
import newsService from '@/features/user/news/services/newsService';
import type {
  UpdateNewsRequest,
  UpdateNewsResponse,
} from '@/features/user/news/services/newsService';

export function useUpdateNews() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<UpdateNewsResponse['data'] | null>(
    null
  );

  const update = React.useCallback(
    async (id: number, payload: UpdateNewsRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await newsService.updateNews(id, payload);
        setData(resp.data ?? null);
        return resp;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    update,
    data,
    isLoading,
    error,
  } as const;
}

export default useUpdateNews;
