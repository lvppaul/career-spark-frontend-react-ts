import React, { useState, useEffect } from 'react';
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
  Row,
  Col,
  Typography,
  Divider,
} from 'antd';
import { Switch } from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  UserAddOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Avatar } from 'antd';

import useUsersPaginated from '@/features/user/user-management/hooks/useUsersPaginated';
import type {
  UserDTO,
  UserFilters,
} from '@/features/user/user-management/type';
import type { RegisterRequest } from '@/features/auth/type';
import { useAuth } from '@/features/auth/hooks/useAuth';
import useUpdateUser from '@/features/user/user-management/hooks/useUpdateUser';
import useToggleActiveUser from '@/features/user/user-management/hooks/useToggleActiveUser';
const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

// Create User Modal component
function CreateUserModal({
  visible,
  onCancel,
  onCreated,
}: {
  visible: boolean;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [form] = Form.useForm();
  const { register } = useAuth();

  const handleFinish = async (values: unknown) => {
    const vals = values as Record<string, unknown>;
    try {
      const payload: RegisterRequest = {
        email: (vals.email as string) ?? '',
        password:
          (vals.password as string) ?? Math.random().toString(36).slice(-10),
        confirmPassword:
          (vals.confirmPassword as string) ?? (vals.password as string),
        name: (vals.name as string) ?? '',
        phone: (vals.phone as string) ?? '',
        roleId: (vals.roleId as string) ?? 'User',
      } as unknown as RegisterRequest;

      const res = await register(payload);
      console.log('register response:', res);
      if (res.success) {
        message.success('Tạo người dùng thành công');
        form.resetFields();
        onCreated();
      } else {
        message.error(res.message || 'Tạo người dùng thất bại');
      }
    } catch (err) {
      console.error('register error:', err);
      message.error('Lỗi khi tạo người dùng');
    }
  };

  return (
    <Modal
      title="Thêm người dùng mới"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="roleId"
              label="Vai trò"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value={'Admin'}>Admin</Option>
                <Option value={'Moderator'}>Moderator</Option>
                <Option value={'User'}>User</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="password" label="Mật khẩu">
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="confirmPassword" label="Xác nhận mật khẩu">
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                onCancel();
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo mới
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}

// Edit User Modal component
function EditUserModal({
  visible,
  onCancel,
  user,
  onUpdated,
}: {
  visible: boolean;
  onCancel: () => void;
  user: UserDTO | null;
  onUpdated: () => void;
}) {
  const [form] = Form.useForm();
  const { updateUser } = useUpdateUser();

  React.useEffect(() => {
    if (user) {
      const roleLabel =
        typeof user.role === 'string' && user.role.length
          ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
          : user.role;
      form.setFieldsValue({
        email: user.email,
        name: user.name,
        phone: user.phone ?? '',
        roleId: roleLabel ?? 'User',
        isActive: user.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const handleFinish = async (values: unknown) => {
    if (!user) return;
    const vals = values as Record<string, unknown>;
    const payload = {
      email: vals.email as string,
      name: vals.name as string,
      phone: (vals.phone as string) ?? '',
      roleId: vals.roleId as string | number,
      isActive: !!vals.isActive,
    };
    try {
      const resp = await updateUser(user.id, payload);
      // debug: log response to help diagnose unexpected server replies
      // (if server returns a redirect/html like '/', it will show here)
      console.log('updateUser response:', resp);
      message.success('Cập nhật người dùng thành công');
      onUpdated();
    } catch (err) {
      console.error('updateUser error:', err);
      message.error('Không thể cập nhật người dùng');
    }
  };

  return (
    <Modal
      title="Chỉnh sửa người dùng"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={[16, 0]}>
          <Col span={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="roleId"
              label="Vai trò"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value={'Admin'}>Admin</Option>
                <Option value={'Moderator'}>Moderator</Option>
                <Option value={'User'}>User</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="isActive"
              label="Hoạt động"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                onCancel();
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}

// FormValues type removed; Create/Edit handled by separate modal components

// helpers moved above to allow use inside modal components

interface UserManagementProps {
  onNavigate: (page: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onNavigate: _ }) => {
  // Use server-side paginated users from user-management module
  const {
    data: serverUsers,
    pagination,
    page,
    pageSize,
    setPage,
    setPageSize,
    isLoading: loading,

    refresh,
  } = useUsersPaginated(1, 10);
  const toggleActiveHook = useToggleActiveUser();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<UserFilters>({});
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Keep a local filtered view (search/filters) over serverUsers
  useEffect(() => {
    const list: UserDTO[] = serverUsers ?? [];
    let filtered: UserDTO[] = [...list];
    if (searchText) {
      filtered = filtered.filter((u) => {
        const email = String(u.email ?? '').toLowerCase();
        const name = String(u.name ?? '').toLowerCase();
        return (
          email.includes(searchText.toLowerCase()) ||
          name.includes(searchText.toLowerCase())
        );
      });
    }
    if (filters.role) {
      filtered = filtered.filter(
        (u) => (u.role ?? '').toLowerCase() === filters.role!.toLowerCase()
      );
    }
    if (typeof filters.isActive === 'boolean') {
      filtered = filtered.filter((u) => u.isActive === filters.isActive);
    }
    if (typeof filters.isVerified === 'boolean') {
      filtered = filtered.filter(
        (u) => (u.isVerified ?? false) === filters.isVerified
      );
    }
    setUsers(filtered);
  }, [serverUsers, searchText, filters]);

  // initial load handled by useUsersPaginated hook

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilterChange = (
    key: keyof UserFilters,
    value: string | boolean | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }) as UserFilters);
  };

  const applyFilters = () => {
    // Reset to first page to apply filters on server if implemented
    setPage(1);
  };

  const handleStatusChange = async (
    userId: number | string,
    newStatus: 'active' | 'inactive' | 'banned'
  ) => {
    const { setActive, deActive } = toggleActiveHook;
    try {
      if (newStatus === 'active') {
        const resp = await setActive(userId);
        console.log('setActive resp:', resp);
        message.success('Kích hoạt thành công');
      } else {
        const resp = await deActive(userId);
        console.log('deActive resp:', resp);
        message.success('Hủy kích hoạt thành công');
      }
      refresh();
    } catch (error) {
      console.error('Error toggling active state:', error);
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const openEditModal = (user: UserDTO) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setCreateModalVisible(true);
  };

  const closeCreateModal = () => {
    setCreateModalVisible(false);
    setSelectedUser(null);
  };
  const closeEditModal = () => {
    setEditModalVisible(false);
    setSelectedUser(null);
  };

  // Create / Edit handled by separate modals

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: 'Hoạt động' },
      inactive: { color: 'orange', text: 'Không hoạt động' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'email',
      key: 'email',
      render: (_: string, record: UserDTO) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={record.avatarURL ?? undefined}
            size={40}
            style={{ marginRight: 12, backgroundColor: '#87d068' }}
          >
            {!record.avatarURL &&
              (record.name ? record.name.charAt(0).toUpperCase() : '?')}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              {record.email}
            </div>
            {record.phone && (
              <div style={{ color: '#666', fontSize: '12px' }}>
                {record.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },

    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (_: unknown, record: UserDTO) =>
        getStatusTag(record.isActive ? 'active' : 'inactive'),
    },

    {
      title: 'Xác thực',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (_: unknown, record: UserDTO) => (
        <Tag color={record.isVerified ? 'green' : 'default'}>
          {record.isVerified ? 'Verified' : 'Unverified'}
        </Tag>
      ),
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
      render: (_: string, record: UserDTO) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            size="small"
            type="primary"
          />
          {record.isActive ? (
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div>
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
                placeholder="Hoạt động"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) =>
                  handleFilterChange(
                    'isActive',
                    value === undefined ? undefined : value === 'true'
                  )
                }
              >
                <Option value="true">Hoạt động</Option>
                <Option value="false">Không hoạt động</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Xác thực"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) =>
                  handleFilterChange(
                    'isVerified',
                    value === undefined ? undefined : value === 'true'
                  )
                }
              >
                <Option value="true">Đã xác thực</Option>
                <Option value="false">Chưa xác thực</Option>
              </Select>
            </Col>
            {/* Removed subscription filter as requested */}
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
            current: pagination?.pageNumber ?? page,
            pageSize: pagination?.pageSize ?? pageSize,
            total: pagination?.totalCount ?? 0,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps ?? pageSize);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
        />
      </div>

      {/* Create & Edit modals (separate components) */}
      <CreateUserModal
        visible={createModalVisible}
        onCancel={closeCreateModal}
        onCreated={() => {
          closeCreateModal();
          refresh();
        }}
      />

      <EditUserModal
        visible={editModalVisible}
        user={selectedUser}
        onCancel={closeEditModal}
        onUpdated={() => {
          closeEditModal();
          refresh();
        }}
      />
    </div>
  );
};

export default UserManagement;
