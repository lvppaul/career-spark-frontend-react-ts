import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Typography,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { User, UserFilters } from '../../../types/admin';
import { demoUsers } from '../../../data/demoData';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

interface UserManagementProps {
  onNavigate: (page: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onNavigate: _ }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<UserFilters>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call with demo data
      await new Promise((resolve) => setTimeout(resolve, 500));
      let filteredUsers = [...demoUsers];

      // Apply search filter
      if (searchText) {
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      // Apply role filter
      if (filters.role) {
        filteredUsers = filteredUsers.filter(
          (user) => user.role === filters.role
        );
      }

      // Apply status filter
      if (filters.status) {
        filteredUsers = filteredUsers.filter(
          (user) => user.status === filters.status
        );
      }

      // Apply subscription filter
      if (filters.subscription) {
        filteredUsers = filteredUsers.filter(
          (user) => user.subscription?.type === filters.subscription
        );
      }

      setUsers(filteredUsers);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [searchText, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilterChange = (
    key: keyof UserFilters,
    value: string | undefined
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    fetchUsers();
  };

  const handleStatusChange = async (
    userId: string,
    newStatus: 'active' | 'inactive' | 'banned'
  ) => {
    try {
      // Simulate API call
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      message.error('Không thể cập nhật trạng thái');
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      message.success('Xóa người dùng thành công');
    } catch (error) {
      message.error('Không thể xóa người dùng');
      console.error('Error deleting user:', error);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(true);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsEditMode(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleSubmit = async (values: Partial<User>) => {
    try {
      if (isEditMode && selectedUser) {
        // Update user
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, ...values } : user
          )
        );
        message.success('Cập nhật người dùng thành công');
      } else {
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          email: values.email!,
          fullName: values.fullName!,
          phone: values.phone,
          role: values.role!,
          status: values.status!,
          createdAt: new Date().toISOString(),
          subscription: { type: 'free' },
        };
        setUsers((prevUsers) => [newUser, ...prevUsers]);
        message.success('Tạo người dùng thành công');
      }
      closeModal();
    } catch (error) {
      message.error('Không thể lưu người dùng');
      console.error('Error saving user:', error);
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: 'Hoạt động' },
      inactive: { color: 'orange', text: 'Không hoạt động' },
      banned: { color: 'red', text: 'Bị cấm' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getRoleTag = (role: string) => {
    return (
      <Tag color={role === 'admin' ? 'purple' : 'blue'}>
        {role === 'admin' ? 'Admin' : 'User'}
      </Tag>
    );
  };

  const getSubscriptionTag = (subscription?: { type: string }) => {
    if (!subscription) return <Tag>Free</Tag>;
    const colors = {
      free: 'default',
      premium: 'gold',
      pro: 'purple',
    };
    return (
      <Tag color={colors[subscription.type as keyof typeof colors]}>
        {subscription.type.toUpperCase()}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'email',
      key: 'email',
      render: (_: string, record: User) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.fullName}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.email}</div>
          {record.phone && (
            <div style={{ color: '#666', fontSize: '12px' }}>
              {record.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => getRoleTag(role),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'subscription',
      key: 'subscription',
      render: (subscription: User['subscription']) =>
        getSubscriptionTag(subscription),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: string, record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            size="small"
            type="primary"
          />
          {record.status === 'active' ? (
            <Popconfirm
              title="Bạn có chắc muốn cấm người dùng này?"
              onConfirm={() => handleStatusChange(record.id, 'banned')}
              okText="Có"
              cancelText="Không"
            >
              <Button icon={<StopOutlined />} size="small" danger />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Bạn có chắc muốn kích hoạt người dùng này?"
              onConfirm={() => handleStatusChange(record.id, 'active')}
              okText="Có"
              cancelText="Không"
            >
              <Button
                icon={<CheckCircleOutlined />}
                size="small"
                type="primary"
                style={{ backgroundColor: '#52c41a' }}
              />
            </Popconfirm>
          )}
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
      }}
    >
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Title level={2} style={{ margin: 0 }}>
              Quản lý người dùng
            </Title>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={openCreateModal}
              size="large"
            >
              Thêm người dùng
            </Button>
          </div>

          <Divider />

          {/* Filters */}
          <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col xs={24} sm={12} md={6}>
              <Search
                placeholder="Tìm kiếm email, tên..."
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Vai trò"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('role', value)}
              >
                <Option value="admin">Admin</Option>
                <Option value="user">User</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Trạng thái"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('status', value)}
              >
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
                <Option value="banned">Bị cấm</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Gói dịch vụ"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('subscription', value)}
              >
                <Option value="free">Free</Option>
                <Option value="premium">Premium</Option>
                <Option value="pro">Pro</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button type="primary" onClick={applyFilters} block>
                Áp dụng
              </Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '16px' }}
        >
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Họ tên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Vai trò"
                name="role"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Select>
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[
                  { required: true, message: 'Vui lòng chọn trạng thái' },
                ]}
              >
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                  <Option value="banned">Bị cấm</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <Space>
              <Button onClick={closeModal}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {isEditMode ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
