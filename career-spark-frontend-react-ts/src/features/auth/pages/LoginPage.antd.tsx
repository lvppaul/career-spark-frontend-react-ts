import React from 'react';
import { Card, Form, Input, Button, Alert, Typography } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { GoogleLoginButton } from '../components/GoogleLoginButton';
import logoXX from '@/assets/images/only-logo-xx.jpg';
import bgLogin from '@/assets/images/career_spark_login_background.png';

const { Title, Text } = Typography;

const LoginPageAntd: React.FC = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const state = location.state as unknown as {
    from?: { pathname?: string };
    message?: string;
  };
  const {
    login,
    loginWithGoogle,
    isLoading,
    error,
    // isAuthenticated is managed internally for redirects; not needed here
    clearError,
  } = useAuth();

  // Let useAuth handle redirect after successful login.
  // We do not navigate here to avoid accidental redirects on error.

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login({ email: values.email, password: values.password });
    } catch (err) {
      // Log unexpected errors
      console.error('Login form submit error', err);
    }
  };

  const handleGoogleLogin = async (tokenResponse: { access_token: string }) => {
    if (!tokenResponse?.access_token) return;
    try {
      await loginWithGoogle({ accessToken: tokenResponse.access_token });
    } catch (err) {
      console.error('Google login error', err);
    }
  };

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

      {/* Centered login card on the shared background */}
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
            <Title level={2} style={{ margin: '8px 0' }}>
              Đăng nhập
            </Title>
            <Text type="secondary">Đăng nhập để tiếp tục</Text>
          </div>

          {state?.message && (
            <Alert
              type="warning"
              message={state.message}
              className="mb-4"
              showIcon
            />
          )}
          {error && (
            <Alert
              type="error"
              message={error}
              className="mb-4"
              showIcon
              closable
              onClose={clearError}
            />
          )}

          <Form form={form} layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="email@example.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
                size="large"
                className="cs-primary-btn"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', margin: '12px 0' }}>
            <span style={{ color: '#999' }}>Hoặc</span>
          </div>

          <div className="flex justify-center mb-3">
            <GoogleLoginButton onTokenReceived={handleGoogleLogin} />
          </div>

          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <Text type="secondary">Chưa có tài khoản? </Text>
            <Link to="/signup">Đăng ký</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPageAntd;
