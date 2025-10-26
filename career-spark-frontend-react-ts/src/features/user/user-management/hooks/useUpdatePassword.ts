import { useCallback, useState } from 'react';
import { passwordService } from '../services/passwordService';
import type { UpdatePasswordRequest, UpdatePasswordResponse } from '../type';

export function useUpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const request = useCallback(
    async (payload: UpdatePasswordRequest): Promise<UpdatePasswordResponse> => {
      if (isLoading)
        return Promise.reject(new Error('Request already in progress'));
      setIsLoading(true);
      setError(null);
      setMessage(null);
      setLastTimestamp(null);

      try {
        const resp = await passwordService.updatePassword(payload);
        setMessage(resp.message);
        if (resp.timestamp) setLastTimestamp(resp.timestamp);
        return resp;
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { data?: { message?: string; errors?: string[] } };
        };
        // Normalize server error message and possible field errors
        const respData = axiosErr?.response?.data as unknown;
        const asRecord =
          typeof respData === 'object' && respData !== null
            ? (respData as Record<string, unknown>)
            : {};
        const msg =
          (asRecord?.message as string) ||
          (Array.isArray(asRecord?.errors)
            ? ((asRecord.errors as unknown[])[0] as string)
            : undefined) ||
          (err instanceof Error ? err.message : 'Failed to update password');
        setError(msg);

        // If errors is an object of field->messages, normalize it
        const errorsVal = (asRecord?.errors as unknown) ?? undefined;
        if (
          errorsVal &&
          typeof errorsVal === 'object' &&
          !Array.isArray(errorsVal)
        ) {
          setServerErrors(errorsVal as Record<string, string>);
        } else if (Array.isArray(errorsVal)) {
          setServerErrors({ general: String((errorsVal as unknown[])[0]) });
        } else {
          setServerErrors(null);
        }
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
    setServerErrors(null);
  }, []);

  return {
    isLoading,
    error,
    message,
    lastTimestamp,
    serverErrors,
    request,
    resetState,
  } as const;
}

export default useUpdatePassword;
