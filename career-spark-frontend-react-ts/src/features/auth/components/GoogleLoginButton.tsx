// src/features/auth/components/GoogleLoginButton.tsx
import React from 'react';
import { Button } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';

interface GoogleLoginButtonProps {
  onLoginSuccess?: (userInfo: unknown) => void;
  onLoginError?: (error: unknown) => void;
  loading?: boolean;
  size?: 'small' | 'middle' | 'large';
  block?: boolean;
}

const GoogleIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.665 15.63 16.89 16.795 15.725 17.575V20.335H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
      fill="#4285F4"
    />
    <path
      d="M12 23C15.24 23 17.955 21.92 19.28 20.335L15.725 17.575C14.74 18.235 13.48 18.625 12 18.625C8.875 18.625 6.235 16.69 5.365 14.035H1.68V16.89C3.005 19.52 7.265 23 12 23Z"
      fill="#34A853"
    />
    <path
      d="M5.365 14.035C5.14 13.375 5.015 12.695 5.015 12S5.14 10.625 5.365 9.965V7.11H1.68C0.99 8.475 0.605 10.19 0.605 12S0.99 15.525 1.68 16.89L5.365 14.035Z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.375C13.615 5.375 15.065 5.93 16.205 6.995L19.36 3.84C17.95 2.525 15.235 1.625 12 1.625C7.265 1.625 3.005 5.105 1.68 7.735L5.365 10.59C6.235 7.935 8.875 6 12 6V5.375Z"
      fill="#EA4335"
    />
  </svg>
);

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onLoginSuccess,
  onLoginError,
  loading = false,
  size = 'large',
  block = true,
}) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Gọi API Google lấy thông tin user
        const res = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const data = await res.json();
        console.log('Google user info:', data);

        onLoginSuccess?.(data);
      } catch (error) {
        onLoginError?.(error);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      onLoginError?.(error);
    },
  });

  return (
    <Button
      type="default"
      size={size}
      block={block}
      loading={loading}
      onClick={() => login()}
      style={{
        height: size === 'large' ? '48px' : size === 'middle' ? '40px' : '32px',
        fontSize: size === 'large' ? '16px' : '14px',
        fontWeight: 500,
        borderRadius: '8px',
        borderColor: '#dadce0',
        backgroundColor: '#fff',
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        transition: 'all 0.2s ease-in-out',
        boxShadow:
          '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)',
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget;
        target.style.backgroundColor = '#f8f9fa';
        target.style.boxShadow =
          '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)';
        target.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.backgroundColor = '#fff';
        target.style.boxShadow =
          '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)';
        target.style.transform = 'translateY(0px)';
      }}
      icon={<GoogleIcon />}
    >
      Đăng nhập với Google
    </Button>
  );
};
