import { useCallback, useEffect, useState } from 'react';
import { userService } from '../services/userService';
import type { UserDTO, PaginatedUsersResponse } from '../type';

export function useUsersPaginated(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [data, setData] = useState<UserDTO[] | null>(null);
  const [pagination, setPagination] = useState<
    PaginatedUsersResponse['pagination'] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const fetchPage = useCallback(
    async (p = page, ps = pageSize) => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await userService.getPaginatedUsers(p, ps, {
          skipLoading: true,
        });
        setData(resp.payload ?? []);
        setPagination(resp.pagination ?? null);
        return resp;
      } catch (err) {
        setError(err);
        setData(null);
        setPagination(null);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const resp = await userService.getPaginatedUsers(page, pageSize, {
          skipLoading: true,
        });
        if (!cancelled) {
          setData(resp.payload ?? []);
          setPagination(resp.pagination ?? null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize]);

  return {
    data,
    pagination,
    page,
    pageSize,
    setPage,
    setPageSize,
    isLoading,
    error,
    refresh: () => fetchPage(page, pageSize),
  } as const;
}

export default useUsersPaginated;
