import React from 'react';
import { adminBlogService } from '@/features/admin/services/blogService';

export function useDeleteBlog() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [result, setResult] = React.useState<{
    success: boolean;
    message?: string;
    timestamp?: string;
  } | null>(null);

  const deleteBlog = React.useCallback(async (id: number | string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await adminBlogService.deleteBlog(id);
      setResult(resp);
      return resp;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteBlog, isLoading, error, result } as const;
}

export default useDeleteBlog;
