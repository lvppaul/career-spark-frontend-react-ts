import React from 'react';
import { Layout } from 'antd';
import AdminHeader from './AdminHeader';

const { Content, Sider } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, sidebar }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Fixed Header */}
      <Layout.Header
        style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0 }}
      >
        <AdminHeader />
      </Layout.Header>

      {/* Main Layout with Sidebar and Content */}
      <Layout style={{ marginTop: 64 }}>
        {sidebar && (
          <Sider
            width={250}
            style={{
              background: '#fff',
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            {sidebar}
          </Sider>
        )}

        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            minHeight: 'calc(100vh - 112px)', // 64px header + 48px margins
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
