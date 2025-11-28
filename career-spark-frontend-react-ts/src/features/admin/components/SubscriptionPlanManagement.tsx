import React from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { SubscriptionPlan } from '@/features/subscription/services/subscriptionPlanService';
import type {
  CreateSubscriptionPlanPayload,
  UpdateSubscriptionPlanPayload,
} from '@/features/admin/services/subscriptionPlanService';
import useActiveSubscriptionPlans from '@/features/admin/hooks/useActiveSubscriptionPlans';
import useCreateSubscriptionPlan from '@/features/admin/hooks/useCreateSubscriptionPlan';
import useUpdateSubscriptionPlan from '@/features/admin/hooks/useUpdateSubscriptionPlan';
import useDeleteSubscriptionPlan from '@/features/admin/hooks/useDeleteSubscriptionPlan';

interface SubscriptionPlanFormValues {
  name: string;
  price: number;
  benefits?: string;
  level: number;
  durationDays: number;
  description?: string;
}

/**
 * Admin component for managing subscription plans
 */
export function SubscriptionPlanManagement() {
  const { data: plans, isLoading, refetch } = useActiveSubscriptionPlans();
  const { createPlan, isLoading: isCreating } = useCreateSubscriptionPlan();
  const { updatePlan, isLoading: isUpdating } = useUpdateSubscriptionPlan();
  const { deletePlan, isLoading: isDeleting } = useDeleteSubscriptionPlan();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<SubscriptionPlan | null>(
    null
  );
  const [form] = Form.useForm<SubscriptionPlanFormValues>();

  // Open modal for creating new plan
  const handleCreate = () => {
    setEditingPlan(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open modal for editing existing plan
  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    form.setFieldsValue({
      name: plan.name,
      price: plan.price,
      benefits: plan.benefits,
      level: plan.level,
      durationDays: plan.durationDays,
      description: plan.description,
    });
    setIsModalOpen(true);
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingPlan) {
        // Update existing plan
        const payload: UpdateSubscriptionPlanPayload = values;
        await updatePlan(editingPlan.id, payload);
      } else {
        // Create new plan
        const payload: CreateSubscriptionPlanPayload = {
          name: values.name,
          price: values.price,
          level: values.level,
          durationDays: values.durationDays,
          benefits: values.benefits,
          description: values.description,
        };
        await createPlan(payload);
      }

      setIsModalOpen(false);
      form.resetFields();
      // Refetch active plans
      refetch();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Handle delete plan
  const handleDelete = async (id: number) => {
    try {
      await deletePlan(id);
      // Refetch active plans
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Cancel modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingPlan(null);
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // Table columns
  const columns: ColumnsType<SubscriptionPlan> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Cấp độ',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      sorter: (a, b) => a.level - b.level,
    },
    {
      title: 'Thời hạn (ngày)',
      dataIndex: 'durationDays',
      key: 'durationDays',
      width: 150,
      sorter: (a, b) => a.durationDays - b.durationDays,
    },
    {
      title: 'Ưu đãi',
      dataIndex: 'benefits',
      key: 'benefits',
      ellipsis: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            type="primary"
          />
          <Popconfirm
            title="Xóa gói đăng ký"
            description="Bạn có chắc chắn muốn xóa gói đăng ký này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: isDeleting }}
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Quản lý gói đăng ký"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Thêm gói mới
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={plans || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} gói`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingPlan ? 'Chỉnh sửa gói đăng ký' : 'Thêm gói đăng ký mới'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={isCreating || isUpdating}
        width={600}
        okText={editingPlan ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="name"
            label="Tên gói"
            rules={[{ required: true, message: 'Vui lòng nhập tên gói' }]}
          >
            <Input placeholder="Ví dụ: Gói Tháng" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VND)"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => {
                const parsed = value?.replace(/\$\s?|(,*)/g, '');
                return parsed ? (Number(parsed) as 0) : 0;
              }}
              placeholder="Ví dụ: 50000"
            />
          </Form.Item>

          <Form.Item
            name="level"
            label="Cấp độ"
            rules={[{ required: true, message: 'Vui lòng nhập cấp độ' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              placeholder="Ví dụ: 1"
            />
          </Form.Item>

          <Form.Item
            name="durationDays"
            label="Thời hạn (ngày)"
            rules={[{ required: true, message: 'Vui lòng nhập thời hạn' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              placeholder="Ví dụ: 30"
            />
          </Form.Item>

          <Form.Item name="benefits" label="Ưu đãi">
            <Input.TextArea rows={3} placeholder="Mô tả các ưu đãi của gói" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea
              rows={3}
              placeholder="Mô tả chi tiết về gói đăng ký"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SubscriptionPlanManagement;
