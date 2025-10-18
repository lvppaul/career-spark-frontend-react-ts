import React, { useState } from 'react';
import { Alert, Typography } from 'antd';
import { useResetPassword } from '../hooks/useResetPassword';

const { Title, Text } = Typography;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ResetPasswordSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { request, isLoading, error, message, resetState } = useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    const errs: Record<string, string> = {};
    if (!email || !emailRegex.test(email)) errs.email = 'Email không hợp lệ';
    if (!token) errs.token = 'Thiếu token (lấy từ link email)';
    if (!newPassword) errs.newPassword = 'Nhập mật khẩu mới';
    if (newPassword !== confirmNewPassword)
      errs.confirmNewPassword = 'Mật khẩu xác nhận không khớp';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      await request({ email, token, newPassword, confirmNewPassword });
    } catch {
      // handled in hook
    }
  };

  return (
    <div>
      <Title level={4}>Đặt lại mật khẩu</Title>
      <Text>Nhập email, token và mật khẩu mới để hoàn tất đặt lại.</Text>
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
              Email
            </label>
            <input
              type="email"
              className={`mt-1 w-full px-3 py-2 border ${fieldErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Token
            </label>
            <input
              type="text"
              className={`mt-1 w-full px-3 py-2 border ${fieldErrors.token ? 'border-red-300' : 'border-gray-300'} rounded-md`}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Token từ link trong email"
            />
            {fieldErrors.token && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.token}</p>
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
              Xác nhận mật khẩu
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
            {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordSection;
