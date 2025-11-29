import { useState, useCallback } from 'react';
import { message } from 'antd';
import { createComment } from '../services/commentService';
import type { CreateCommentRequest } from '../services/commentService';

/**
 * Hook to create a new comment
 */
export function useCreateComment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(async (payload: CreateCommentRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createComment(payload);
      if (response.success) {
        message.success(response.message || 'Bình luận thành công');
        return response.data;
      } else {
        throw new Error(response.message || 'Không thể tạo bình luận');
      }
    } catch (err) {
      console.error('Failed to create comment:', err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      message.error(error.message || 'Không thể tạo bình luận');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    create,
    isLoading,
    error,
  };
}

export default useCreateComment;
