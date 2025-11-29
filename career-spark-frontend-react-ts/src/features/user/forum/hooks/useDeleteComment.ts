import { useState, useCallback } from 'react';
import { message } from 'antd';
import { deleteComment } from '../services/commentService';

/**
 * Hook to delete a comment
 */
export function useDeleteComment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = useCallback(async (commentId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        message.success(response.message || 'Xóa bình luận thành công');
        return true;
      } else {
        throw new Error(response.message || 'Không thể xóa bình luận');
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      message.error(error.message || 'Không thể xóa bình luận');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    remove,
    isLoading,
    error,
  };
}

export default useDeleteComment;
