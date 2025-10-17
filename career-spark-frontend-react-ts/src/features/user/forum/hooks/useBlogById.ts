import { useCallback, useEffect, useState } from 'react';
import { forumService } from '@/features/user/forum/services/forumService';
import type { BlogItem } from '@/features/user/forum/type';

export function useBlogById(id?: number | null) {
  const [data, setData] = useState<BlogItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async (blogId?: number | null) => {
    if (!blogId) return null;
    setIsLoading(true);
    setError(null);
    try {
      const resp = await forumService.getBlogById(blogId);
      setData(resp.data ?? null);
      return resp;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetch(id).catch(() => {});
    }
  }, [fetch, id]);

  const refetch = useCallback(() => fetch(id), [fetch, id]);

  return { data, isLoading, error, refetch } as const;
}

export default useBlogById;
