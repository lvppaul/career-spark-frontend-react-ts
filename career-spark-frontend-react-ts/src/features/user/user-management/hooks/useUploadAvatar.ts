import { useState } from 'react';
import { userService } from '../services/userService';

export function useUploadAvatar() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadAvatar = async (id: number | string, file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // Delegate upload to userService to keep API surface centralized
      const resp = await userService.uploadUserAvatar(id, file);
      return resp;
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      throw e;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, error, uploadAvatar } as const;
}

export default useUploadAvatar;
