import React, { useState } from 'react';
import { Typography, Button, Space, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '@/features/auth/hooks/useAuth';

const { Title } = Typography;

interface AdminHeaderProps {
  onNavigate?: (page: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = () => {
  const { user, forceLogout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      console.log('AdminHeader: Calling forceLogout...');
      await forceLogout();
    } catch (error) {
      // Fallback if something goes wrong
      console.error('Logout failed:', error);
      window.location.replace('/login');
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất',
      onClick: () => {
        console.log('AdminHeader: Logout menu item clicked!');
        handleLogout();
      },
      danger: true,
      disabled: isLoggingOut,
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 64,
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
        Career Spark Admin
      </Title>

      <Space size={16}>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Button
            type="text"
            style={{
              padding: '4px 8px',
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Avatar
              size={32}
              icon={<UserOutlined />}
              style={{
                backgroundColor: '#1890ff',
                cursor: 'pointer',
              }}
            />
            <span style={{ color: '#262626' }}>{user?.name || 'Admin'}</span>
          </Button>
        </Dropdown>
      </Space>
    </div>
  );
};

export default AdminHeader;
