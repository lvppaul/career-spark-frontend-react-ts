import { useCallback, useState } from 'react';
import { authService } from '../services/authService';

export const useVerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const verifyEmail = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await authService.verifyEmail(email);
      setData(res);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { verifyEmail, isLoading, error, data } as const;
};
