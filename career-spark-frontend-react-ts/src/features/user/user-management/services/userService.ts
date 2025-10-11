import api from '@/lib/axios';
import type { GetUserByIdResponse, UserDTO } from '../type';
import { tokenUtils } from '@/utils/tokenUtils';
import { authService } from '@/features/auth/services/authService';
import type { User as AuthUser } from '@/features/auth/type';

async function getUserByIdFn(
  id: number | string,
  options?: { skipLoading?: boolean }
): Promise<GetUserByIdResponse> {
  const headers: Record<string, string> = {};
  if (options?.skipLoading) headers['x-skip-loading'] = 'true';

  const resp = await api.get<GetUserByIdResponse>(`/User/${id}`, { headers });
  return resp.data;
}

// JSON update for user profile (matches backend example)
async function updateUserProfileFn(
  id: number | string,
  payload: {
    email?: string;
    name?: string;
    phone?: string;
    roleId?: string | number;
    isActive?: boolean;
  },
  options?: { skipLoading?: boolean }
): Promise<GetUserByIdResponse> {
  const headers: Record<string, string> = {};
  if (options?.skipLoading) headers['x-skip-loading'] = 'true';

  const resp = await api.put<{
    success: boolean;
    message: string;
    payload: UserDTO;
  }>(`/User/${id}`, payload, { headers });

  // Backend returns wrapper with payload containing updated user DTO
  const updatedPayload = resp.data.payload as UserDTO | undefined;

  // Map backend DTO into auth User shape and update local storage so header updates
  try {
    const current = tokenUtils.getUserData();
    const mapped: AuthUser = {
      sub: String(updatedPayload?.id ?? current?.sub ?? id),
      name: updatedPayload?.name ?? current?.name ?? '',
      email: updatedPayload?.email ?? current?.email ?? '',
      Role: updatedPayload?.role ?? current?.Role ?? 'User',
      avatarURL: updatedPayload?.avatarURL ?? current?.avatarURL,
      aud: current?.aud ?? '',
      iss: current?.iss ?? '',
      exp: Number(current?.exp ?? 0),
      iat: Number(current?.iat ?? 0),
      nbf: Number(current?.nbf ?? 0),
    };
    authService.updateLocalUser(mapped);
  } catch (err) {
    // non-fatal: keep update success even if local update fails
    console.warn('Failed to update local auth user after profile update', err);
  }

  return resp.data;
}

// Upload avatar via dedicated endpoint: POST /User/{id}/avatar
async function uploadUserAvatarFn(
  id: number | string,
  file: File,
  options?: { skipLoading?: boolean }
): Promise<{
  success: boolean;
  message: string;
  payload: { avatarURL: string };
}> {
  const headers: Record<string, string> = {};
  if (options?.skipLoading) headers['x-skip-loading'] = 'true';

  const formData = new FormData();
  formData.append('file', file, file.name);

  const resp = await api.put<{
    success: boolean;
    message: string;
    payload: { avatarURL: string };
  }>(`/User/${id}/avatar`, formData, { headers });

  const result = resp.data;

  // On successful upload, update local auth user to refresh header avatar
  try {
    const newAvatar = result.payload?.avatarURL;
    if (newAvatar) {
      const current = tokenUtils.getUserData();
      const mapped: AuthUser = {
        sub: String(current?.sub ?? id),
        name: current?.name ?? '',
        email: current?.email ?? '',
        Role: current?.Role ?? 'User',
        avatarURL: newAvatar,
        aud: current?.aud ?? '',
        iss: current?.iss ?? '',
        exp: Number(current?.exp ?? 0),
        iat: Number(current?.iat ?? 0),
        nbf: Number(current?.nbf ?? 0),
      };
      authService.updateLocalUser(mapped);
    }
  } catch (err) {
    console.warn('Failed to update local auth user after avatar upload', err);
  }

  return result;
}

// Backwards-compatible helper: updateUser can accept either JSON or FormData (legacy)
async function updateUserFn(
  id: number | string,
  payload:
    | {
        email?: string;
        name?: string;
        phone?: string;
        roleId?: string | number;
        isActive?: boolean;
      }
    | FormData,
  options?: { skipLoading?: boolean }
): Promise<GetUserByIdResponse> {
  if (payload instanceof FormData) {
    const headers: Record<string, string> = {};
    if (options?.skipLoading) headers['x-skip-loading'] = 'true';
    const resp = await api.put<GetUserByIdResponse>(`/User/${id}`, payload, {
      headers,
    });
    return resp.data;
  }

  return await updateUserProfileFn(id, payload, options);
}

export const userService = {
  /**
   * Get user by id
   * @param id user id
   * @param options skipLoading - set true to avoid showing global loading overlay
   */
  getUserById: getUserByIdFn,
  // Update user profile (PUT /User/{id}) - payload shape should match backend
  // JSON update for user profile (matches backend example)
  updateUserProfile: updateUserProfileFn,

  // Upload avatar via dedicated endpoint: POST /User/{id}/avatar
  uploadUserAvatar: uploadUserAvatarFn,

  // Backwards-compatible aliases
  updateUser: async (
    id: number | string,
    payload:
      | {
          email?: string;
          name?: string;
          phone?: string;
          roleId?: string | number;
          isActive?: boolean;
        }
      | FormData,
    options?: { skipLoading?: boolean }
  ): Promise<GetUserByIdResponse> => {
    // If payload is FormData, call avatar upload path (deprecated combined endpoint)
    return await updateUserFn(id, payload, options);
  },
  // Upload avatar via dedicated endpoint: POST /User/{id}/avatar
  uploadAvatar: async (
    id: number | string,
    file: File,
    options?: { skipLoading?: boolean }
  ) => {
    return await uploadUserAvatarFn(id, file, options);
  },
};

export default userService;
