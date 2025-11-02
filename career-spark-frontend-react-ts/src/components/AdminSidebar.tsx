import React from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/router/constants';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
  ];

  return (
    <div style={{ padding: '16px 0' }}>
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
  );
};

export default AdminSidebar;
