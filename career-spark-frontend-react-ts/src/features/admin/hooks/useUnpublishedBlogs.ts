import { useCallback, useEffect, useState } from 'react';
import { getUnpublishedBlogsAdmin } from '@/features/admin/services/blogService';
import type {
  PublishedResponse,
  BlogItem,
  Pagination,
} from '@/features/user/forum/type';

export function useUnpublishedBlogs(initialPage = 1, initialSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [data, setData] = useState<BlogItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (p = page, s = size) => {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      try {
        const res: PublishedResponse = await getUnpublishedBlogsAdmin(p, s);
        setData(res.data || []);
        setPagination(res.pagination || null);
        setMessage(res.message || null);
        return res;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [page, size]
  );

  useEffect(() => {
    fetchPage(page, size).catch(() => {});
  }, [fetchPage, page, size]);

  return {
    data,
    pagination,
    isLoading,
    error,
    message,
    page,
    size,
    setPage,
    setSize,
    refresh: () => fetchPage(page, size),
  } as const;
}

export default useUnpublishedBlogs;
