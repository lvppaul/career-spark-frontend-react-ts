import React from 'react';
import forumService from '@/features/user/forum/services/forumService';
import type {
  CreateBlogRequest,
  CreateBlogResponse,
} from '@/features/user/forum/type';

export function useCreateBlog() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [result, setResult] = React.useState<CreateBlogResponse | null>(null);

  const create = React.useCallback(async (payload: CreateBlogRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await forumService.createBlog(payload);
      setResult(resp as CreateBlogResponse);
      return resp as CreateBlogResponse;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    create,
    isLoading,
    error,
    result,
  } as const;
}

export default useCreateBlog;
