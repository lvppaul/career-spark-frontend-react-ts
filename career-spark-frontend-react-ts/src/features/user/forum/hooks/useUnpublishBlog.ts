import React from 'react';
import { forumService } from '@/features/user/forum/services/forumService';

export function useUnpublishBlog() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [result, setResult] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const unpublish = React.useCallback(async (id: number | string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await forumService.unpublishBlog(id as number);
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

  return { unpublish, isLoading, error, result } as const;
}

export default useUnpublishBlog;
