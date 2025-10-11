import { useCallback, useState } from 'react';
import { userService } from '../services/userService';
import type { GetUserByIdResponse, UserDTO } from '../type';

export function useUserLazy(options?: { skipLoading?: boolean }) {
  const [data, setData] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const load = useCallback(
    async (id: number | string) => {
      setIsLoading(true);
      setError(null);
      try {
        const resp: GetUserByIdResponse = await userService.getUserById(id, {
          skipLoading: options?.skipLoading,
        });
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

  return {
    data,
    isLoading,
    error,
    load,
  };
}

export default useUserLazy;
