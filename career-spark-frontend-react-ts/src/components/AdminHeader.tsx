import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

interface AdminHeaderProps {
  onNavigate?: (page: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = () => {
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
    </div>
  );
};

export default AdminHeader;
