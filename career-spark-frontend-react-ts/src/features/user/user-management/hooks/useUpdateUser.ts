import { useState } from 'react';
import { userService } from '../services/userService';
import type { GetUserByIdResponse } from '../type';

export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateUser = async (
    id: number | string,
    payload: {
      email?: string;
      name?: string;
      phone?: string;
      roleId?: string | number;
      isActive?: boolean;
    }
  ): Promise<GetUserByIdResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await userService.updateUser(id, payload);
      return resp;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, updateUser } as const;
}

export default useUpdateUser;
