import React, { useState } from 'react';
import { Menu, Button, Avatar, Space, Divider } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  ShoppingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/router/constants';
import { useAuth } from '@/features/auth/hooks/useAuth';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, forceLogout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      console.log('AdminSidebar: Calling forceLogout...');
      await forceLogout();
    } catch (error) {
      // Fallback if something goes wrong
      console.error('Logout failed:', error);
      window.location.replace('/login');
    }
  };

  const menuItems = [
    {
      key: ADMIN_ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate(ADMIN_ROUTES.DASHBOARD),
    },
    {
      key: ADMIN_ROUTES.USER_MANAGEMENT,
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
      onClick: () => navigate(ADMIN_ROUTES.USER_MANAGEMENT),
    },

    {
      key: ADMIN_ROUTES.BLOG_MANAGEMENT,
      icon: <FileTextOutlined />,
      label: 'Quản lý bài viết',
      onClick: () => navigate(ADMIN_ROUTES.BLOG_MANAGEMENT),
    },
    {
      key: ADMIN_ROUTES.BLOG_UNPUBLISHED,
      icon: <FileTextOutlined />,
      label: 'Bài viết chờ duyệt',
      onClick: () => navigate(ADMIN_ROUTES.BLOG_UNPUBLISHED),
    },
    {
      key: ADMIN_ROUTES.NEWS_MANAGEMENT,
      icon: <FileTextOutlined />,
      label: 'Quản lý tin tức',
      onClick: () => navigate(ADMIN_ROUTES.NEWS_MANAGEMENT),
    },
    {
      key: ADMIN_ROUTES.SUBSCRIPTION_PLANS,
      icon: <CreditCardOutlined />,
      label: 'Quản lý gói đăng ký',
      onClick: () => navigate(ADMIN_ROUTES.SUBSCRIPTION_PLANS),
    },
    {
      key: ADMIN_ROUTES.ORDERS,
      icon: <ShoppingOutlined />,
      label: 'Quản lý đơn hàng',
      onClick: () => navigate(ADMIN_ROUTES.ORDERS),
    },
  ];

  return (
    <div
      style={{
        padding: '16px 0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* User Profile Section */}
      <div style={{ padding: '0 16px 16px 16px' }}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: '#f0f2f5',
              borderRadius: '8px',
            }}
          >
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{
                backgroundColor: '#1890ff',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#262626',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.name || 'Admin'}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#8c8c8c',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email || 'admin@careerspark.com'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            loading={isLoggingOut}
            block
            size="large"
            style={{
              borderRadius: '8px',
              fontWeight: 500,
            }}
          >
            {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </Button>
        </Space>
      </div>

      <Divider style={{ margin: '0 0 16px 0' }} />

      {/* Menu Items */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            border: 'none',
            background: 'transparent',
          }}
          items={menuItems}
        />
      </div>
    </div>
  );
};

export default AdminSidebar;
