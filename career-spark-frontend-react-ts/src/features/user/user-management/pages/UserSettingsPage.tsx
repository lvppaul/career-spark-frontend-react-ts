import React, { useState } from 'react';
import { Card, Typography, Menu } from 'antd';
import ForgotPasswordSection from '../components/ForgotPasswordSection';
import ResetPasswordSection from '../components/ResetPasswordSection';

const { Title, Text } = Typography;

const UserSettingsPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState<'forgot' | 'reset'>('forgot');

  const onSelect = (key: 'forgot' | 'reset') => setActiveKey(key);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Card>
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-64 md:pr-6 border-b md:border-b-0 md:border-r border-gray-200 mb-4 md:mb-0">
            <div className="px-2 py-3">
              <Title level={4} style={{ margin: 0 }}>
                Cài đặt tài khoản
              </Title>
              <Text type="secondary">Quản lý bảo mật</Text>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[activeKey]}
              onClick={(e) => onSelect(e.key as 'forgot' | 'reset')}
              items={[
                { key: 'forgot', label: 'Quên mật khẩu' },
                { key: 'reset', label: 'Đặt lại mật khẩu' },
              ]}
            />
          </div>

          {/* Content */}
          <div className="flex-1 md:pl-6">
            {activeKey === 'forgot' && <ForgotPasswordSection />}
            {activeKey === 'reset' && <ResetPasswordSection />}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserSettingsPage;
