import { useState } from 'react';
import { userService } from '../services/userService';

export default function useToggleActiveUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setActive = async (id: number | string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userService.setActive(id);
      return res;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deActive = async (id: number | string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await userService.deActive(id);
      return res;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, setActive, deActive } as const;
}
