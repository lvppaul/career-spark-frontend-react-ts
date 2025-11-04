import React from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  DatePicker,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import useOrders from '@/features/admin/hooks/useOrders';
import type { AdminOrderData } from '@/features/admin/services/orderService';

/**
 * Admin component for managing orders
 */
export function OrderManagement() {
  const {
    data: orders,
    pagination,
    isLoading,
    updateParams,
    refetch,
  } = useOrders();

  // Handle date picker change
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      const year = date.year();
      const month = date.month() + 1; // dayjs month is 0-indexed
      updateParams({ year, month, pageNumber: 1 });
    } else {
      updateParams({ year: undefined, month: undefined, pageNumber: 1 });
    }
  };

  // Handle pagination change
  const handleTableChange = (page: number, pageSize: number) => {
    updateParams({ pageNumber: page, pageSize });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'failed':
        return 'error';
      case 'expired':
        return 'default';
      default:
        return 'default';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'cancelled':
        return 'Đã hủy';
      case 'failed':
        return 'Thất bại';
      case 'expired':
        return 'Hết hạn';
      default:
        return status;
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // Format datetime
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!orders) return { total: 0, paid: 0, pending: 0, revenue: 0 };

    const total = orders.length;
    const paid = orders.filter((o) => o.status.toLowerCase() === 'paid').length;
    const pending = orders.filter(
      (o) => o.status.toLowerCase() === 'pending'
    ).length;
    const revenue = orders
      .filter((o) => o.status.toLowerCase() === 'paid')
      .reduce((sum, o) => sum + o.amount, 0);

    return { total, paid, pending, revenue };
  }, [orders]);

  // Table columns
  const columns: ColumnsType<AdminOrderData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'subscriptionPlanName',
      key: 'subscriptionPlanName',
      width: 130,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => formatCurrency(amount),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => (
        <Tag
          color={getStatusColor(status)}
          icon={
            status.toLowerCase() === 'paid' ? (
              <CheckCircleOutlined />
            ) : status.toLowerCase() === 'pending' ? (
              <ClockCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
        >
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Đã thanh toán', value: 'Paid' },
        { text: 'Chờ thanh toán', value: 'Pending' },
        { text: 'Đã hủy', value: 'Cancelled' },
        { text: 'Thất bại', value: 'Failed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'payOSTransactionId',
      key: 'payOSTransactionId',
      width: 120,
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: formatDateTime,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paidAt',
      key: 'paidAt',
      width: 140,
      render: formatDateTime,
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiredAt',
      key: 'expiredAt',
      width: 140,
      render: formatDateTime,
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={pagination?.totalCount || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã thanh toán"
              value={stats.paid}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ thanh toán"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.revenue}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              suffix="₫"
            />
          </Card>
        </Col>
      </Row>

      {/* Orders Table */}
      <Card
        title="Quản lý đơn hàng"
        extra={
          <Space>
            <DatePicker
              picker="month"
              placeholder="Chọn tháng"
              onChange={handleDateChange}
              format="MM/YYYY"
              allowClear
              style={{ width: 150 }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isLoading}
            >
              Làm mới
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={orders || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: pagination?.pageNumber || 1,
            pageSize: pagination?.pageSize || 10,
            total: pagination?.totalCount || 0,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
            onChange: handleTableChange,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>
    </div>
  );
}

export default OrderManagement;
