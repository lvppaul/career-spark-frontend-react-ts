// src/features/auth/components/GoogleLoginButton.tsx
import { useGoogleLogin } from '@react-oauth/google';

interface GoogleLoginButtonProps {
  onLoginSuccess?: (userInfo: unknown) => void;
  onLoginError?: (error: unknown) => void;
}

export const GoogleLoginButton = ({
  onLoginSuccess,
  onLoginError,
}: GoogleLoginButtonProps) => {
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
    <button
      onClick={() => login()}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
    >
      Continue with Google
    </button>
  );
};
