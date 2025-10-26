import { useCallback, useState } from 'react';
import { authService } from '../services/authService';
import type { ConfirmEmailResponse } from '../type';

export const useConfirmEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ConfirmEmailResponse | null>(null);

  const confirmEmail = useCallback(async (email: string, token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setData(null);

      const res = await authService.confirmEmail(email, token);
      setData(res as ConfirmEmailResponse);
      return res;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Confirm email failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []); // ✅ giữ reference ổn định

  const clear = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return { confirmEmail, isLoading, error, data, clear } as const;
};
