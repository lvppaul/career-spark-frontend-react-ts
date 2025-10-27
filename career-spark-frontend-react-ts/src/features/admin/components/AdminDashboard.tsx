import React, { useState, useEffect } from 'react';
import {
  Card,
  Statistic,
  Row,
  Col,
  Spin,
  Button,
  List,
  Avatar,
  Typography,
  Space,
} from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  TrophyOutlined,
  UsergroupAddOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import { demoStats, demoActivities } from '../../../data/demoData';

const { Title, Paragraph } = Typography;

interface Activity {
  id: string;
  description: string;
  timestamp: string;
  type: string;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call with demo data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStats(demoStats);
      setActivities(demoActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to demo data
      setStats(demoStats);
      setActivities(demoActivities);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <UsergroupAddOutlined style={{ color: '#52c41a' }} />;
      case 'question_created':
        return <QuestionCircleOutlined style={{ color: '#1890ff' }} />;
      case 'test_completed':
        return <TrophyOutlined style={{ color: '#faad14' }} />;
      case 'user_banned':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <BarChartOutlined style={{ color: '#722ed1' }} />;
    }
  };

  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2}>Bảng điều khiển Admin</Title>
        <Paragraph type="secondary">Tổng quan hệ thống và quản lý</Paragraph>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng hoạt động"
              value={stats?.activeUsers || 0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng câu hỏi"
              value={stats?.totalQuestions || 0}
              prefix={<QuestionCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bài test hoàn thành"
              value={stats?.testsCompleted || 0}
              prefix={<BarChartOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions & Recent Activities */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={12}>
          <Card title="Thao tác nhanh" extra={<Space />}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Button
                  type="primary"
                  size="large"
                  icon={<UserOutlined />}
                  onClick={() => onNavigate('user-management')}
                  block
                >
                  Quản lý người dùng
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  size="large"
                  icon={<QuestionCircleOutlined />}
                  onClick={() => onNavigate('question-management')}
                  block
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  Quản lý câu hỏi
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Hoạt động gần đây">
            <List
              dataSource={activities}
              renderItem={(activity) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={getActivityIcon(activity.type)} />}
                    title={activity.description}
                    description={new Date(activity.timestamp).toLocaleString(
                      'vi-VN'
                    )}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Đăng ký hôm nay"
              value={stats?.todaySignups || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Người dùng Premium"
              value={stats?.premiumUsers || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Người dùng bị cấm"
              value={stats?.bannedUsers || 0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
