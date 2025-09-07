import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, Space, Card, Statistic } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import AdminDashboard from '../components/AdminDashboard';
import UserManagement from '../components/UserManagement';
import QuestionManagement from '../components/QuestionManagement';

const { Sider, Content, Header } = Layout;
const { Title } = Typography;

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

type AdminView = 'dashboard' | 'user-management' | 'question-management';

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
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

  const handleNavigate = (page: string) => {
    setCurrentView(page as AdminView);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'user-management':
        return <UserManagement onNavigate={onNavigate} />;
      case 'question-management':
        return <QuestionManagement onNavigate={onNavigate} />;
      default:
        return <AdminDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          Career Spark Admin
        </Title>
        <Space>
          <span style={{ color: '#666' }}>Admin Panel</span>
          <Button 
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => onNavigate('home')}
          >
            Về trang chủ
          </Button>
        </Space>
      </Header>

      <Layout>
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          theme="light"
          width={280}
          style={{ 
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)'
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
              border: 'none'
            }}
          />

          {/* Quick Stats in Sidebar */}
          {!collapsed && (
            <div style={{ margin: '24px 16px' }}>
              <Card size="small" title="Thống kê nhanh">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <TeamOutlined style={{ color: '#52c41a' }} />
                      <span style={{ fontSize: '12px' }}>Online:</span>
                    </Space>
                    <Statistic 
                      value={24} 
                      valueStyle={{ fontSize: '14px', color: '#52c41a' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#1890ff' }} />
                      <span style={{ fontSize: '12px' }}>Tests hôm nay:</span>
                    </Space>
                    <Statistic 
                      value={12} 
                      valueStyle={{ fontSize: '14px', color: '#1890ff' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        
        <Layout>
          <Content style={{ margin: 0, background: '#f0f2f5' }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
