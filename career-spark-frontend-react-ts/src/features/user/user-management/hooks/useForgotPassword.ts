import { useState, useCallback } from 'react';
import { passwordService } from '../services/passwordService';
import type { ForgotPasswordResponse } from '../type';

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);

  const request = useCallback(
    async (email: string): Promise<ForgotPasswordResponse> => {
      if (isLoading)
        return Promise.reject(new Error('Request already in progress'));
      setIsLoading(true);
      setError(null);
      setMessage(null);
      setLastTimestamp(null);

      try {
        const resp = await passwordService.forgotPassword(email);
        setMessage(resp.message);
        if (resp.timestamp) setLastTimestamp(resp.timestamp);
        return resp;
      } catch (err: unknown) {
        // Normalize axios/server error message
        const axiosErr = err as {
          response?: { data?: { message?: string; errors?: string[] } };
        };
        const msg =
          axiosErr?.response?.data?.message ||
          axiosErr?.response?.data?.errors?.[0] ||
          (err instanceof Error ? err.message : 'Failed to send reset email');
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

export default useForgotPassword;
