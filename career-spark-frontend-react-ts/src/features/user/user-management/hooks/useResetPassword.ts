import { useCallback, useState } from 'react';
import { passwordService } from '../services/passwordService';
import type { ResetPasswordRequest, ResetPasswordResponse } from '../type';

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);

  const request = useCallback(
    async (payload: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
      if (isLoading)
        return Promise.reject(new Error('Request already in progress'));
      setIsLoading(true);
      setError(null);
      setMessage(null);
      setLastTimestamp(null);

      try {
        const resp = await passwordService.resetPassword(payload);
        setMessage(resp.message);
        if (resp.timestamp) setLastTimestamp(resp.timestamp);
        return resp;
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: {
            data?: { message?: string; errors?: string[] };
          };
        };
        const msg =
          axiosErr?.response?.data?.message ||
          axiosErr?.response?.data?.errors?.[0] ||
          (err instanceof Error ? err.message : 'Failed to reset password');
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const resetState = useCallback(() => {
    setError(null);
    setMessage(null);
    setLastTimestamp(null);
  }, []);

  return {
    isLoading,
    error,
    message,
    lastTimestamp,
    request,
    resetState,
  } as const;
}

export default useResetPassword;
