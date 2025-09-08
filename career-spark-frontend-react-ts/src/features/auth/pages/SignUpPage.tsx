import React, { useState } from 'react';
import { notification } from 'antd';

interface SignUpPageProps {
  onNavigate?: (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup'
  ) => void;
}

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token?: string;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): boolean => {
    return password === confirmPassword && password.length > 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must meet all requirements');
      return;
    }

    if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call (replace with actual API endpoint)
      const response = await simulateSignUp(formData);

      if (response.success) {
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token || '');

        // Show success notification with Ant Design
        notification.success({
          message: 'Đăng ký thành công!',
          description: `Chào mừng bạn đến với CareerSpark, ${response.user?.name || 'User'}! Tài khoản của bạn đã được tạo thành công.`,
          placement: 'topRight',
          duration: 4.5,
          style: {
            marginTop: 60,
          },
        });

        // Navigate to home page after a short delay
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('home');
          }
        }, 1500);
      } else {
        // Show error notification
        notification.error({
          message: 'Đăng ký thất bại!',
          description: response.message,
          placement: 'topRight',
          duration: 3,
          style: {
            marginTop: 60,
          },
        });
      }
    } catch (err) {
      // Show error notification for network/system errors
      notification.error({
        message: 'Lỗi hệ thống!',
        description: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.',
        placement: 'topRight',
        duration: 3,
        style: {
          marginTop: 60,
        },
      });
      console.error('SignUp error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate signup API call (replace with real API)
  const simulateSignUp = async (
    credentials: SignUpFormData
  ): Promise<SignUpResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if email already exists (simulation)
        if (credentials.email === 'existing@careerspark.com') {
          resolve({
            success: false,
            message: 'Email này đã được sử dụng. Vui lòng chọn email khác.',
          });
        } else {
          resolve({
            success: true,
            message: 'Account created successfully',
            user: {
              id: '2',
              email: credentials.email,
              name: credentials.email.split('@')[0],
              role: 'user',
            },
            token: 'fake-jwt-token-67890',
          });
        }
      }, 1000); // Simulate network delay
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-white flex">
        {/* Left Side - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
              Sign up
            </h1>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-blue-600 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    error && !validateEmail(formData.email) && formData.email
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder=""
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-blue-600 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12 ${
                      error &&
                      !validatePassword(formData.password) &&
                      formData.password
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder=""
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-blue-600 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12 ${
                      error &&
                      !validateConfirmPassword(
                        formData.password,
                        formData.confirmPassword
                      ) &&
                      formData.confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder=""
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex flex-wrap gap-4">
                  <span
                    className={
                      formData.password.length >= 8 ? 'text-green-600' : ''
                    }
                  >
                    • Use 8 or more characters
                  </span>
                  <span
                    className={
                      /[A-Z]/.test(formData.password) &&
                      /[a-z]/.test(formData.password)
                        ? 'text-green-600'
                        : ''
                    }
                  >
                    • Use upper and lower case letters (e.g. Aa)
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <span
                    className={
                      /\d/.test(formData.password) ? 'text-green-600' : ''
                    }
                  >
                    • Use a number (e.g. 1234)
                  </span>
                  <span
                    className={
                      /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                        ? 'text-green-600'
                        : ''
                    }
                  >
                    • Use a symbol (e.g. !@#$)
                  </span>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.email ||
                  !formData.password ||
                  !formData.confirmPassword
                }
                className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                  isLoading ||
                  !formData.email ||
                  !formData.password ||
                  !formData.confirmPassword
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isLoading ? 'Creating Account...' : 'Sign up'}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate && onNavigate('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-none"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
