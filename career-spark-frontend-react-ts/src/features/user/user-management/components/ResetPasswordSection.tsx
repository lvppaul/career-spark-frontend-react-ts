import React, { useState } from 'react';
import { Alert, Typography } from 'antd';
import { useUpdatePassword } from '../hooks/useUpdatePassword';

const { Title, Text } = Typography;

const ResetPasswordSection: React.FC = () => {
  // Authenticated change-password UI
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { request, isLoading, error, message, resetState, serverErrors } =
    useUpdatePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    // clear previous field errors
    setFieldErrors({});
    const errs: Record<string, string> = {};
    if (!currentPassword) errs.currentPassword = 'Nhập mật khẩu hiện tại';
    if (!newPassword) errs.newPassword = 'Nhập mật khẩu mới';
    if (newPassword !== confirmNewPassword)
      errs.confirmNewPassword = 'Mật khẩu xác nhận không khớp';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      console.log('Before Password update response:');
      const resp = await request({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      console.log('Password update response:', resp);

      // Optionally clear fields on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch {
      // error stored in hook
    }
  };

  // Merge server-side field errors (if any) into local fieldErrors so they display inline
  React.useEffect(() => {
    if (!serverErrors) return;
    setFieldErrors((prev) => ({ ...prev, ...serverErrors }));
  }, [serverErrors]);

  return (
    <div>
      <Title level={4}>Đổi mật khẩu</Title>
      <Text>Đổi mật khẩu cho tài khoản của bạn (bạn cần đăng nhập).</Text>
      <div className="mt-4">
        {message && (
          <Alert type="success" message={message} showIcon className="mb-3" />
        )}
        {error && (
          <Alert type="error" message={error} showIcon className="mb-3" />
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              className={`mt-1 w-full px-3 py-2 border ${fieldErrors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            {fieldErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <input
              type="password"
              className={`mt-1 w-full px-3 py-2 border ${fieldErrors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
            {fieldErrors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              className={`mt-1 w-full px-3 py-2 border ${fieldErrors.confirmNewPassword ? 'border-red-300' : 'border-gray-300'} rounded-md`}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
            />
            {fieldErrors.confirmNewPassword && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.confirmNewPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="cs-primary-btn px-4 py-2 rounded text-white disabled:opacity-50"
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordSection;
