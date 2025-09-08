import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  header,
  sidebar,
}) => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {header}
      <Layout>
        {sidebar}
        <Content style={{ margin: 0, background: '#f0f2f5' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
