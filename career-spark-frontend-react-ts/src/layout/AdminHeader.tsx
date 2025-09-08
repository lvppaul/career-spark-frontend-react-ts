import React from 'react';
import { Typography, Button, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface AdminHeaderProps {
  onNavigate?: (page: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onNavigate }) => {
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
      }}
    >
      <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
        Career Spark Admin
      </Title>
      <Space>
        <span style={{ color: '#666' }}>Admin Panel</span>
        <Button
          type="primary"
          icon={<HomeOutlined />}
          onClick={() => onNavigate && onNavigate('home')}
        >
          Về trang chủ
        </Button>
      </Space>
    </div>
  );
};

export default AdminHeader;
