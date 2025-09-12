import React, { useState } from 'react';
import { Layout, Menu, Space, Card, Statistic } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import { AdminLayout } from '../../../layout';
import AdminHeader from '../../../layout/AdminHeader';
import AdminDashboard from '../components/AdminDashboard';
import UserManagement from '../components/UserManagement';
import QuestionManagement from '../components/QuestionManagement';

const { Sider } = Layout;

type AdminView = 'dashboard' | 'user-management' | 'question-management';

const AdminPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
    },
    {
      key: 'user-management',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
    },
    {
      key: 'question-management',
      icon: <QuestionCircleOutlined />,
      label: 'Quản lý câu hỏi',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    setCurrentView(key as AdminView);
  };

  const handleNavigate = () => {
    // TODO: Implement router-based navigation
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'user-management':
        return <UserManagement onNavigate={handleNavigate} />;
      case 'question-management':
        return <QuestionManagement onNavigate={handleNavigate} />;
      default:
        return <AdminDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <AdminLayout
      header={<AdminHeader onNavigate={handleNavigate} />}
      sidebar={
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
          width={280}
          style={{
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Menu
            defaultSelectedKeys={['dashboard']}
            selectedKeys={[currentView]}
            mode="inline"
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              marginTop: '16px',
              border: 'none',
            }}
          />

          {/* Quick Stats in Sidebar */}
          {!collapsed && (
            <div style={{ margin: '24px 16px' }}>
              <Card size="small" title="Thống kê nhanh">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Space>
                      <TeamOutlined style={{ color: '#52c41a' }} />
                      <span style={{ fontSize: '12px' }}>Online:</span>
                    </Space>
                    <Statistic
                      value={24}
                      valueStyle={{ fontSize: '14px', color: '#52c41a' }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Space>
                      <CheckCircleOutlined style={{ color: '#1890ff' }} />
                      <span style={{ fontSize: '12px' }}>Tests hôm nay:</span>
                    </Space>
                    <Statistic
                      value={12}
                      valueStyle={{ fontSize: '14px', color: '#1890ff' }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Space>
                      <QuestionOutlined style={{ color: '#722ed1' }} />
                      <span style={{ fontSize: '12px' }}>Câu hỏi active:</span>
                    </Space>
                    <Statistic
                      value={156}
                      valueStyle={{ fontSize: '14px', color: '#722ed1' }}
                    />
                  </div>
                </Space>
              </Card>
            </div>
          )}
        </Sider>
      }
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPage;
