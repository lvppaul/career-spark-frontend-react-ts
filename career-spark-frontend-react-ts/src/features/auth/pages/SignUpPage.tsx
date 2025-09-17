import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

interface LocationState {
  from?: Location;
  message?: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  roleId: number;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'Ít nhất 8 ký tự', test: (pwd) => pwd.length >= 8 },
  { label: 'Chứa chữ hoa (A-Z)', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'Chứa chữ thường (a-z)', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'Chứa số (0-9)', test: (pwd) => /\d/.test(pwd) },
  {
    label: 'Chứa ký tự đặc biệt (!@#$)',
    test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  },
];

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { register, isLoading, error, isAuthenticated, clearError } = useAuth();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    roleId: 1, // Default to User role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<SignUpFormData>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SignUpFormData, boolean>>
  >({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, state]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Validation functions
  const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Họ tên là bắt buộc';
    if (name.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
    if (name.trim().length > 50) return 'Họ tên không được quá 50 ký tự';
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email là bắt buộc';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email không hợp lệ';
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) return 'Số điện thoại là bắt buộc';
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Số điện thoại phải có 10-11 chữ số';
    }
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Mật khẩu là bắt buộc';

    const failedRequirements = passwordRequirements.filter(
      (req) => !req.test(password)
    );
    if (failedRequirements.length > 0) {
      return `Mật khẩu phải thỏa mãn: ${failedRequirements.map((req) => req.label).join(', ')}`;
    }

    return null;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string | null => {
    if (!confirmPassword) return 'Xác nhận mật khẩu là bắt buộc';
    if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp';
    return null;
  };

  const validateForm = (): boolean => {
    const errors: Partial<SignUpFormData> = {};

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (phoneError) errors.phone = phoneError;
    if (passwordError) errors.password = passwordError;
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'roleId' ? parseInt(value) : value,
    }));

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Clear validation error for this field
    if (validationErrors[name as keyof SignUpFormData]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      roleId: true,
    });

    if (!validateForm()) return;

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/\s/g, ''),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        roleId: formData.roleId,
      });

      // Success - redirect will happen via useAuth hook
      const redirectTo = state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const getFieldError = (fieldName: keyof SignUpFormData): string | null => {
    if (!touched[fieldName]) return null;
    const error = validationErrors[fieldName];
    return typeof error === 'string' ? error : null;
  };

  const isPasswordStrong = passwordRequirements.every((req) =>
    req.test(formData.password)
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img
            className="mx-auto h-16 w-auto"
            src="/logo_exe.jpg"
            alt="Career Spark"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              state={state}
              className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
            >
              đăng nhập tại đây
            </Link>
          </p>
        </div>

        {/* Redirect message */}
        {state?.message && (
          <div className="rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">{state.message}</p>
          </div>
        )}

        {/* Sign up form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Họ và tên *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  getFieldError('name') ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-200`}
                placeholder="Nhập họ và tên của bạn"
              />
              {getFieldError('name') && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError('name')}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  getFieldError('email') ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-200`}
                placeholder="Nhập email của bạn"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError('email')}
                </p>
              )}
            </div>

            {/* Phone field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Số điện thoại *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  getFieldError('phone') ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-200`}
                placeholder="Nhập số điện thoại"
              />
              {getFieldError('phone') && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError('phone')}
                </p>
              )}
            </div>

            {/* Role selection */}
            <div>
              <label
                htmlFor="roleId"
                className="block text-sm font-medium text-gray-700"
              >
                Loại tài khoản *
              </label>
              <select
                id="roleId"
                name="roleId"
                value={formData.roleId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value={1}>Người dùng</option>
                <option value={2}>Quản trị viên</option>
              </select>
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu *
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                    getFieldError('password')
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-200`}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((requirement, index) => {
                    const isValid = requirement.test(formData.password);
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        {isValid ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-red-400" />
                        )}
                        <span
                          className={`text-xs ${isValid ? 'text-green-600' : 'text-gray-500'}`}
                        >
                          {requirement.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError('password')}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Xác nhận mật khẩu *
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                    getFieldError('confirmPassword')
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-200`}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {getFieldError('confirmPassword') && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError('confirmPassword')}
                </p>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !isPasswordStrong}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang tạo tài khoản...
                </div>
              ) : (
                'Tạo tài khoản'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Bằng việc tạo tài khoản, bạn đồng ý với{' '}
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link
              to="/privacy"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Chính sách bảo mật
            </Link>{' '}
            của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
