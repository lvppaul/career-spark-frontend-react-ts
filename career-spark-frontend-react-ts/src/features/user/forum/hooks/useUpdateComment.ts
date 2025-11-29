import { useState, useCallback } from 'react';
import { message } from 'antd';
import { updateComment } from '../services/commentService';

/**
 * Hook to update a comment
 */
export function useUpdateComment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(async (commentId: number, content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await updateComment(commentId, content);
      if (response.success) {
        message.success(response.message || 'Cập nhật bình luận thành công');
        return response.data;
      } else {
        throw new Error(response.message || 'Không thể cập nhật bình luận');
      }
    } catch (err) {
      console.error('Failed to update comment:', err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      message.error(error.message || 'Không thể cập nhật bình luận');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    update,
    isLoading,
    error,
  };
}

export default useUpdateComment;
