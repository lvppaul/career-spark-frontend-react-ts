import { useCallback, useEffect, useState } from 'react';
import { userService } from '../services/userService';
import type { GetUserByIdResponse, UserDTO } from '../type';

export function useUser(
  id?: number | string | null,
  options?: { skipLoading?: boolean; enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;
  const [data, setData] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const fetchUser = useCallback(
    async (userId?: number | string) => {
      if (userId == null) return null;
      setIsLoading(true);
      setError(null);
      try {
        const resp: GetUserByIdResponse = await userService.getUserById(
          userId,
          {
            skipLoading: options?.skipLoading,
          }
        );
        setData(resp.payload ?? null);
        return resp.payload ?? null;
      } catch (err) {
        setError(err);
        setData(null);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [options?.skipLoading]
  );

  useEffect(() => {
    if (!enabled) return;
    if (id == null) {
      setData(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const resp = await userService.getUserById(id, {
          skipLoading: options?.skipLoading,
        });
        if (!cancelled) setData(resp.payload ?? null);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, enabled, options?.skipLoading]);

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchUser(id ?? undefined),
  };
}

export default useUser;
