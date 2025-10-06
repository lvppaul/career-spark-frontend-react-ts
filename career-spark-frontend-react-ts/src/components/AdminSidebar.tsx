import React from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  BarChartOutlined,
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
      key: ADMIN_ROUTES.QUESTION_MANAGEMENT,
      icon: <QuestionCircleOutlined />,
      label: 'Quản lý câu hỏi',
      onClick: () => navigate(ADMIN_ROUTES.QUESTION_MANAGEMENT),
    },
    {
      key: '/admin/reports',
      icon: <BarChartOutlined />,
      label: 'Báo cáo thống kê',
      onClick: () => console.log('Navigate to reports'),
    },
    {
      key: '/admin/content',
      icon: <FileTextOutlined />,
      label: 'Quản lý nội dung',
      onClick: () => console.log('Navigate to content management'),
    },
    {
      key: ADMIN_ROUTES.SETTINGS,
      icon: <SettingOutlined />,
      label: 'Cài đặt hệ thống',
      onClick: () => navigate(ADMIN_ROUTES.SETTINGS),
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
