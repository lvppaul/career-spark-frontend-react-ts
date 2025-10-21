import api from '@/lib/axios';
import type {
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
} from '../type';

/**
 * Request backend to send a reset password email to the given address.
 * POST /Authentication/forgot-password
 */
export async function forgotPasswordFn(
  email: string
): Promise<ForgotPasswordResponse> {
  const resp = await api.post<ForgotPasswordResponse>(
    '/Authentication/forgot-password',
    { email }
  );
  return resp.data;
}

export const passwordService = {
  forgotPassword: forgotPasswordFn,
  async resetPassword(
    payload: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    // Backend expects { email, token, newPassword, confirmNewPassword }
    const { email, token, newPassword, confirmNewPassword } = payload;
    const resp = await api.post<ResetPasswordResponse>(
      '/Authentication/reset-password',
      { email, token, newPassword, confirmNewPassword }
    );
    return resp.data;
  },
  async updatePassword(
    payload: UpdatePasswordRequest
  ): Promise<UpdatePasswordResponse> {
    const { currentPassword, newPassword, confirmNewPassword } = payload;
    console.log('Before Updating password with payload:', payload);
    const resp = await api.put<UpdatePasswordResponse>(
      '/User/update-my-password',
      { currentPassword, newPassword, confirmNewPassword }
    );
    console.log('After Updating password response data:', resp.data);
    return resp.data;
  },
};

export default passwordService;
