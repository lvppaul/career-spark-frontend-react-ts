import { useEffect, useState, useCallback } from 'react';
import { forumService } from '../services/forumService';
import type { BlogItem, PublishedResponse } from '../type';

export function usePublishedBlogs(initialPage = 1, initialSize = 5) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [data, setData] = useState<BlogItem[]>([]);
  const [pagination, setPagination] = useState<
    PublishedResponse['pagination'] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPage = useCallback(
    async (p = page, size = pageSize) => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await forumService.getPublishedBlogs(p, size);
        setData(resp.data || []);
        setPagination(resp.pagination || null);
        return resp;
      } catch (err: unknown) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize]
  );

  useEffect(() => {
    fetchPage(page, pageSize).catch(() => {});
  }, [fetchPage, page, pageSize]);

  const refetch = useCallback(
    () => fetchPage(page, pageSize),
    [fetchPage, page, pageSize]
  );

  return {
    data,
    pagination,
    page,
    pageSize,
    setPage,
    setPageSize,
    isLoading,
    error,
    refetch,
  } as const;
}

export default usePublishedBlogs;
