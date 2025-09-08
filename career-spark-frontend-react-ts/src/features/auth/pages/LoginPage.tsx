import React, { useState } from 'react';
import { notification } from 'antd';

interface LoginPageProps {
  onNavigate?: (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup'
  ) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
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

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
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
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call (replace with actual API endpoint)
      const response = await simulateLogin(formData);

      if (response.success) {
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token || '');

        // Show success notification with Ant Design
        notification.success({
          message: 'Đăng nhập thành công!',
          description: `Chào mừng bạn trở lại, ${response.user?.name || 'User'}! Bạn đã đăng nhập thành công vào hệ thống CareerSpark.`,
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
          message: 'Đăng nhập thất bại!',
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
        description: 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.',
        placement: 'topRight',
        duration: 3,
        style: {
          marginTop: 60,
        },
      });
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate login API call (replace with real API)
  const simulateLogin = async (
    credentials: LoginFormData
  ): Promise<LoginResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Demo credentials
        if (
          credentials.email === 'user@careerspark.com' &&
          credentials.password === 'password123'
        ) {
          resolve({
            success: true,
            message: 'Login successful',
            user: {
              id: '1',
              email: credentials.email,
              name: 'John Doe',
              role: 'user',
            },
            token: 'fake-jwt-token-12345',
          });
        } else {
          resolve({
            success: false,
            message: 'Email hoặc mật khẩu không chính xác',
          });
        }
      }, 1000); // Simulate network delay
    });
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'user@careerspark.com',
      password: 'password123',
    });

    // Show info notification about demo credentials
    notification.info({
      message: 'Tài khoản demo đã được điền!',
      description: 'Nhấn "Sign In" để đăng nhập với tài khoản demo.',
      placement: 'topRight',
      duration: 3,
      style: {
        marginTop: 60,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-white flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
              Login
            </h1>

            {/* Demo Credentials */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Demo Account:
              </h3>
              <p className="text-sm text-yellow-700 mb-2">
                Email: user@careerspark.com
                <br />
                Password: password123
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
              >
                Use Demo Credentials
              </button>
            </div>

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
                  Email *
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
                  placeholder="Enter your email"
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
                  Password *
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
                    placeholder="Enter your password"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.email || !formData.password}
                className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ${
                  isLoading || !formData.email || !formData.password
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate && onNavigate('signup')}
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer bg-transparent border-none"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
