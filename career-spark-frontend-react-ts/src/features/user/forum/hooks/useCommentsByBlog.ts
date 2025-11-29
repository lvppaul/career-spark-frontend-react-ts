import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getCommentsByBlogId } from '../services/commentService';
import type { Comment } from '../services/commentService';

/**
 * Hook to fetch comments for a specific blog
 */
export function useCommentsByBlog(blogId: number | null) {
  const [data, setData] = useState<Comment[] | null>(null);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!blogId) {
      setData(null);
      setCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getCommentsByBlogId(blogId);
      if (response.success) {
        setData(response.data || []);
        setCount(response.count || 0);
      } else {
        throw new Error(response.message || 'Không thể tải bình luận');
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      message.error('Không thể tải bình luận');
      setData([]);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  return {
    data,
    count,
    isLoading,
    error,
    refetch,
  };
}

export default useCommentsByBlog;
