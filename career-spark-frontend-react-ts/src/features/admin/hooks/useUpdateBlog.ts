import { useState } from 'react';
import { adminBlogService } from '@/features/admin/services/blogService';
import type { CreateBlogResponse } from '@/features/user/forum/type';

export function useUpdateBlog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateBlog = async (
    id: number | string,
    payload: { title?: string; tag?: string; content?: string }
  ): Promise<CreateBlogResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await adminBlogService.updateBlog(id, payload);
      return resp;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, updateBlog } as const;
}

export default useUpdateBlog;
