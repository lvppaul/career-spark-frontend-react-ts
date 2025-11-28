import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Alert, Typography, Modal } from 'antd';
import logoXX from '@/assets/images/only-logo-xx.jpg';
import bgLogin from '@/assets/images/career_spark_login_background.png';
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

  const [registered, setRegistered] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    roleId: 3,
  });

  const initialFormData: SignUpFormData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    roleId: 3,
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<SignUpFormData>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SignUpFormData, boolean>>
  >({});
  // Only block submit while an API call is in-flight
  const verifyEmailCalledRef = useRef(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, state]);

  // After successful registration, redirect to login after 7 seconds
  useEffect(() => {
    if (!registered) return;

    const timer = setTimeout(() => {
      navigate('/login');
    }, 6000);

    return () => clearTimeout(timer);
  }, [registered, navigate]);

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
    // Prevent concurrent submissions while API is running
    if (isLoading || verifyEmailCalledRef.current) return;
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (!validateForm()) return;

    if (verifyEmailCalledRef.current) return;
    verifyEmailCalledRef.current = true;
    try {
      const res = await register(formData);
      if (res.success) {
        // Reset form and set registered
        setFormData(initialFormData);
        setValidationErrors({});
        setTouched({});
        setShowPassword(false);
        setShowConfirmPassword(false);
        setRegistered(true);
      } else {
        // Map to a specific field if provided; fallback to email commonly
        const field = res.errorField || ('email' as keyof SignUpFormData);
        setValidationErrors({
          ...validationErrors,
          [field]: res.message,
        } as Partial<SignUpFormData>);
      }
    } finally {
      // allow retry once API finishes
      verifyEmailCalledRef.current = false;
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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* dark overlay so content stays readable */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Fixed logo in top-left corner */}
      <div className="fixed z-50 flex items-center gap-4 top-[40px] left-[70px] md:top-[70px]">
        <img
          src={logoXX}
          alt="Career Spark"
          className="rounded-full bg-white p-3 shadow-md"
          style={{ height: 88, width: 88, objectFit: 'cover' }}
        />
        <div className="block">
          <div className="text-white text-2xl font-extrabold">Career Spark</div>
        </div>
      </div>

      {/* Centered signup card on the shared background */}
      <div
        className="w-full flex items-center justify-center p-6"
        style={{ position: 'relative', zIndex: 10 }}
      >
        <Card
          style={{
            width: 'min(640px, 92vw)',
            borderRadius: 12,
            padding: 28,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          }}
          bodyStyle={{ padding: 24 }}
        >
          <div className="text-center mb-6">
            <Typography.Title level={2} style={{ margin: '8px 0' }}>
              Tạo tài khoản mới
            </Typography.Title>
            <Typography.Text type="secondary">
              Đăng ký để tiếp tục
            </Typography.Text>
          </div>

          {state?.message && (
            <Alert type="warning" message={state.message} className="mb-4" />
          )}
          {error && (
            <Alert
              type="error"
              message={String(error)}
              className="mb-4"
              showIcon
              closable
              onClose={clearError}
            />
          )}

          {registered && (
            <Alert
              type="success"
              message="Đăng ký thành công, vui lòng kiểm tra email của bạn"
              className="mb-4"
            />
          )}

          <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
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
                    getFieldError('email')
                      ? 'border-red-300'
                      : 'border-gray-300'
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
                    getFieldError('phone')
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-200`}
                  placeholder="Nhập số điện thoại"
                />
                {getFieldError('phone') && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError('phone')}
                  </p>
                )}
              </div>

              {/* Role is fixed (hidden) */}
              <input
                type="hidden"
                name="roleId"
                value={String(formData.roleId)}
              />

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
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
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

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !isPasswordStrong}
                className="cs-primary-btn group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
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

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <Typography.Text type="secondary">
              Đã có tài khoản?{' '}
            </Typography.Text>
            <Link to="/login" state={state} className="ml-1">
              Đăng nhập
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Bằng việc tạo tài khoản, bạn đồng ý với{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-indigo-600 hover:text-indigo-500 underline bg-transparent border-none cursor-pointer"
              >
                Điều khoản sử dụng
              </button>{' '}
              và{' '}
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-indigo-600 hover:text-indigo-500 underline bg-transparent border-none cursor-pointer"
              >
                Chính sách bảo mật
              </button>{' '}
              của chúng tôi.
            </p>
          </div>

          {/* Terms Modal */}
          <Modal
            title="Điều khoản sử dụng"
            open={showTermsModal}
            onOk={() => setShowTermsModal(false)}
            onCancel={() => setShowTermsModal(false)}
            width={800}
            okText="Đã hiểu"
            cancelText="Đóng"
          >
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Mục đích sử dụng
                </h3>
                <p className="text-blue-700">
                  CareerSpark cung cấp dịch vụ tư vấn nghề nghiệp và test RIASEC
                  nhằm giúp người dùng khám phá và phát triển sự nghiệp phù hợp
                  với năng lực và sở thích cá nhân.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  Quyền của người dùng
                </h3>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Được sử dụng tất cả tính năng sau khi đăng ký</li>
                  <li>Được bảo vệ thông tin cá nhân theo quy định</li>
                  <li>Được hỗ trợ kỹ thuật khi gặp vấn đề</li>
                  <li>Có thể hủy tài khoản bất cứ lúc nào</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">
                  Nghĩa vụ của người dùng
                </h3>
                <ul className="list-disc list-inside text-orange-700 space-y-1">
                  <li>Cung cấp thông tin chính xác khi đăng ký</li>
                  <li>Không chia sẻ tài khoản cho người khác sử dụng</li>
                  <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                  <li>Tuân thủ các quy định của cộng đồng</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">
                  Các hành vi bị nghiêm cấm
                </h3>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>Tạo nhiều tài khoản giả mạo</li>
                  <li>Chia sẻ nội dung không phù hợp</li>
                  <li>Cố gắng hack hoặc phá hoại hệ thống</li>
                  <li>Sử dụng bot hoặc công cụ tự động</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Điều khoản khác
                </h3>
                <p className="text-gray-700">
                  CareerSpark có quyền cập nhật điều khoản này bất cứ lúc nào.
                  Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa
                  với việc bạn chấp nhận các điều khoản mới.
                </p>
              </div>
            </div>
          </Modal>

          {/* Privacy Modal */}
          <Modal
            title="Chính sách bảo mật"
            open={showPrivacyModal}
            onOk={() => setShowPrivacyModal(false)}
            onCancel={() => setShowPrivacyModal(false)}
            width={800}
            okText="Đã hiểu"
            cancelText="Đóng"
          >
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Thông tin chúng tôi thu thập
                </h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Thông tin cá nhân: họ tên, email, số điện thoại</li>
                  <li>Kết quả test RIASEC và lịch sử hoạt động</li>
                  <li>Thông tin kỹ thuật: IP, browser, thiết bị</li>
                  <li>Cookies và dữ liệu phiên làm việc</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  Mục đích sử dụng dữ liệu
                </h3>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Cung cấp dịch vụ tư vấn nghề nghiệp</li>
                  <li>Cải thiện trải nghiệm người dùng</li>
                  <li>Gửi thông báo quan trọng về dịch vụ</li>
                  <li>Phân tích và thống kê sử dụng</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">
                  Bảo vệ thông tin
                </h3>
                <ul className="list-disc list-inside text-purple-700 space-y-1">
                  <li>Mã hóa SSL/TLS cho tất cả giao tiếp</li>
                  <li>Lưu trữ dữ liệu trên server bảo mật</li>
                  <li>Giới hạn quyền truy cập theo chức năng</li>
                  <li>Backup và sao lưu dữ liệu định kỳ</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Chia sẻ thông tin
                </h3>
                <p className="text-yellow-700">
                  Chúng tôi cam kết <strong>KHÔNG</strong> chia sẻ thông tin cá
                  nhân của bạn cho bên thứ ba trừ khi có yêu cầu pháp lý hoặc
                  được sự đồng ý của bạn.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">
                  Quyền của bạn
                </h3>
                <ul className="list-disc list-inside text-orange-700 space-y-1">
                  <li>Xem, sửa đổi thông tin cá nhân</li>
                  <li>Yêu cầu xóa tài khoản và dữ liệu</li>
                  <li>Từ chối nhận email marketing</li>
                  <li>Khiếu nại về việc xử lý dữ liệu</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Liên hệ</h3>
                <p className="text-gray-700">
                  Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:
                  <br />
                  Email: careerspark86@gmail.com
                  <br />
                  Hotline: 096 234 90 26
                </p>
              </div>
            </div>
          </Modal>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
