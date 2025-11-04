import React, { useMemo } from 'react';
import {
  Card,
  Statistic,
  Row,
  Col,
  Spin,
  Typography,
  DatePicker,
  Space,
  Empty,
  Table,
  Avatar,
  Tag,
} from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  CalendarOutlined,
  ReloadOutlined,
  UserOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import { useRevenueByDay } from '../hooks/useRevenueByDay';
import { useRevenueByMonth } from '../hooks/useRevenueByMonth';
import { useRevenueByYear } from '../hooks/useRevenueByYear';
import { useTopSpenders } from '../hooks/useTopSpenders';
import { useTopSpendersLast7Days } from '../hooks/useTopSpendersLast7Days';
import type { TopSpender } from '../services/orderService';

const { Title } = Typography;

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const currentDate = dayjs();
  const [selectedYear, setSelectedYear] = React.useState(currentDate.year());
  const [selectedMonth, setSelectedMonth] = React.useState(
    currentDate.month() + 1
  );

  // Fetch revenue data
  const {
    data: revenueByDay,
    isLoading: loadingDay,
    refetch: refetchDay,
    updateParams: updateDayParams,
  } = useRevenueByDay({
    year: selectedYear,
    month: selectedMonth,
  });

  const {
    data: revenueByMonth,
    isLoading: loadingMonth,
    refetch: refetchMonth,
    updateParams: updateMonthParams,
  } = useRevenueByMonth({
    year: selectedYear,
  });

  const {
    data: revenueByYear,
    isLoading: loadingYear,
    refetch: refetchYear,
  } = useRevenueByYear();

  const {
    data: topSpenders,
    isLoading: loadingTopSpenders,
    refetch: refetchTopSpenders,
  } = useTopSpenders({ top: 10 });

  const {
    data: topSpendersLast7Days,
    isLoading: loadingTopSpenders7Days,
    refetch: refetchTopSpenders7Days,
  } = useTopSpendersLast7Days({ top: 10 });

  // Update hooks params when selectedYear or selectedMonth changes
  React.useEffect(() => {
    updateDayParams({ year: selectedYear, month: selectedMonth });
  }, [selectedYear, selectedMonth, updateDayParams]);

  React.useEffect(() => {
    updateMonthParams({ year: selectedYear });
  }, [selectedYear, updateMonthParams]);

  // Calculate today's revenue
  const todayRevenue = useMemo(() => {
    if (!revenueByDay) return 0;
    const today = currentDate.date();
    const todayData = revenueByDay.find((item) => item.key === today);
    return todayData?.value || 0;
  }, [revenueByDay, currentDate]);

  // Calculate this month's revenue
  const thisMonthRevenue = useMemo(() => {
    if (!revenueByMonth) return 0;
    const currentMonth = currentDate.month() + 1;
    const monthData = revenueByMonth.find((item) => item.key === currentMonth);
    return monthData?.value || 0;
  }, [revenueByMonth, currentDate]);

  // Calculate this year's revenue
  const thisYearRevenue = useMemo(() => {
    if (!revenueByYear) return 0;
    const currentYear = currentDate.year();
    const yearData = revenueByYear.find((item) => item.key === currentYear);
    return yearData?.value || 0;
  }, [revenueByYear, currentDate]);

  // Format data for charts
  const dayChartData = useMemo(() => {
    if (!revenueByDay) return [];
    return revenueByDay.map((item) => ({
      day: `Ngày ${item.key}`,
      revenue: item.value,
    }));
  }, [revenueByDay]);

  const monthChartData = useMemo(() => {
    if (!revenueByMonth) return [];
    const monthNames = [
      'T1',
      'T2',
      'T3',
      'T4',
      'T5',
      'T6',
      'T7',
      'T8',
      'T9',
      'T10',
      'T11',
      'T12',
    ];
    return revenueByMonth.map((item) => ({
      month: monthNames[item.key - 1],
      revenue: item.value,
    }));
  }, [revenueByMonth]);

  const yearChartData = useMemo(() => {
    if (!revenueByYear) return [];
    return revenueByYear.map((item) => ({
      year: item.key.toString(),
      revenue: item.value,
    }));
  }, [revenueByYear]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const handleRefreshAll = () => {
    refetchDay();
    refetchMonth();
    refetchYear();
    refetchTopSpenders();
    refetchTopSpenders7Days();
  };

  const isLoading =
    loadingDay ||
    loadingMonth ||
    loadingYear ||
    loadingTopSpenders ||
    loadingTopSpenders7Days;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Bảng điều khiển Admin
          </Title>
          <Typography.Text type="secondary">
            Tổng quan doanh thu và thống kê
          </Typography.Text>
        </div>
        <Space>
          <DatePicker
            picker="month"
            value={dayjs(`${selectedYear}-${selectedMonth}`, 'YYYY-M')}
            onChange={(date) => {
              if (date) {
                setSelectedYear(date.year());
                setSelectedMonth(date.month() + 1);
              }
            }}
            format="MM/YYYY"
            allowClear={false}
          />
          <DatePicker
            picker="year"
            value={dayjs(`${selectedYear}`, 'YYYY')}
            onChange={(date) => {
              if (date) {
                setSelectedYear(date.year());
              }
            }}
            format="YYYY"
            allowClear={false}
          />
          <ReloadOutlined
            style={{
              fontSize: '20px',
              cursor: 'pointer',
              color: '#1890ff',
            }}
            onClick={handleRefreshAll}
            spin={isLoading}
          />
        </Space>
      </div>

      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
          }}
        >
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      )}

      {!isLoading && (
        <>
          {/* Revenue Summary Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                <Statistic
                  title={
                    <span style={{ color: '#fff', fontSize: '16px' }}>
                      💰 Doanh thu hôm nay
                    </span>
                  }
                  value={todayRevenue}
                  prefix={<DollarOutlined />}
                  suffix="₫"
                  valueStyle={{ color: '#fff', fontSize: '28px' }}
                  formatter={(value) =>
                    new Intl.NumberFormat('vi-VN').format(Number(value))
                  }
                />
                <Typography.Text style={{ color: '#fff', opacity: 0.8 }}>
                  {currentDate.format('DD/MM/YYYY')}
                </Typography.Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                style={{
                  background:
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  border: 'none',
                }}
              >
                <Statistic
                  title={
                    <span style={{ color: '#fff', fontSize: '16px' }}>
                      📅 Doanh thu tháng này
                    </span>
                  }
                  value={thisMonthRevenue}
                  prefix={<CalendarOutlined />}
                  suffix="₫"
                  valueStyle={{ color: '#fff', fontSize: '28px' }}
                  formatter={(value) =>
                    new Intl.NumberFormat('vi-VN').format(Number(value))
                  }
                />
                <Typography.Text style={{ color: '#fff', opacity: 0.8 }}>
                  Tháng {currentDate.format('MM/YYYY')}
                </Typography.Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                style={{
                  background:
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  border: 'none',
                }}
              >
                <Statistic
                  title={
                    <span style={{ color: '#fff', fontSize: '16px' }}>
                      🎯 Doanh thu năm nay
                    </span>
                  }
                  value={thisYearRevenue}
                  prefix={<RiseOutlined />}
                  suffix="₫"
                  valueStyle={{ color: '#fff', fontSize: '28px' }}
                  formatter={(value) =>
                    new Intl.NumberFormat('vi-VN').format(Number(value))
                  }
                />
                <Typography.Text style={{ color: '#fff', opacity: 0.8 }}>
                  Năm {currentDate.format('YYYY')}
                </Typography.Text>
              </Card>
            </Col>
          </Row>

          {/* Daily Revenue Chart and Top Spenders Last 7 Days */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <span>
                    📈 Doanh thu theo ngày - Tháng {selectedMonth}/
                    {selectedYear}
                  </span>
                }
                bordered={false}
              >
                {dayChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={dayChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          'Doanh thu',
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                        name="Doanh thu (VNĐ)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="Không có dữ liệu" />
                )}
              </Card>
            </Col>

            {/* Top Spenders Last 7 Days */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <span>
                    <CrownOutlined style={{ color: '#ff4d4f' }} /> Top 10 Người
                    Chi Tiêu 7 Ngày Qua
                  </span>
                }
                bordered={false}
                style={{ height: '100%' }}
              >
                {loadingTopSpenders7Days ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '40px 0',
                    }}
                  >
                    <Spin />
                  </div>
                ) : topSpendersLast7Days && topSpendersLast7Days.length > 0 ? (
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    <Table<TopSpender>
                      dataSource={topSpendersLast7Days}
                      pagination={false}
                      size="small"
                      rowKey="userId"
                      columns={[
                        {
                          title: '#',
                          key: 'rank',
                          width: 50,
                          align: 'center',
                          render: (_, __, index) => {
                            if (index === 0)
                              return (
                                <Tag
                                  color="gold"
                                  style={{ fontWeight: 'bold' }}
                                >
                                  🥇
                                </Tag>
                              );
                            if (index === 1)
                              return (
                                <Tag
                                  color="silver"
                                  style={{ fontWeight: 'bold' }}
                                >
                                  🥈
                                </Tag>
                              );
                            if (index === 2)
                              return (
                                <Tag
                                  color="orange"
                                  style={{ fontWeight: 'bold' }}
                                >
                                  🥉
                                </Tag>
                              );
                            return (
                              <span style={{ color: '#8c8c8c' }}>
                                {index + 1}
                              </span>
                            );
                          },
                        },
                        {
                          title: 'Người dùng',
                          key: 'user',
                          render: (_, record) => (
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <Avatar
                                size={32}
                                icon={<UserOutlined />}
                                style={{
                                  backgroundColor: '#ff4d4f',
                                  marginRight: '8px',
                                }}
                              />
                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontWeight: 500,
                                    fontSize: '13px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {record.userName}
                                </div>
                                <div
                                  style={{
                                    fontSize: '11px',
                                    color: '#8c8c8c',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {record.email}
                                </div>
                              </div>
                            </div>
                          ),
                        },
                        {
                          title: 'Tổng chi',
                          key: 'total',
                          align: 'right',
                          width: 100,
                          render: (_, record) => (
                            <span
                              style={{
                                fontWeight: 600,
                                color: '#ff4d4f',
                                fontSize: '13px',
                              }}
                            >
                              {new Intl.NumberFormat('vi-VN').format(
                                record.total
                              )}
                              ₫
                            </span>
                          ),
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <Empty description="Không có dữ liệu" />
                )}
              </Card>
            </Col>
          </Row>

          {/* Monthly Revenue Chart */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <span>📊 Doanh thu theo tháng - Năm {selectedYear}</span>
                }
                bordered={false}
              >
                {monthChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          'Doanh thu',
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="#82ca9d"
                        name="Doanh thu (VNĐ)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="Không có dữ liệu" />
                )}
              </Card>
            </Col>

            {/* Top Spenders Table */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <span>
                    <CrownOutlined style={{ color: '#faad14' }} /> Top 10 Người
                    Chi Tiêu Tháng Này
                  </span>
                }
                bordered={false}
                style={{ height: '100%' }}
              >
                {loadingTopSpenders ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '40px 0',
                    }}
                  >
                    <Spin />
                  </div>
                ) : topSpenders && topSpenders.length > 0 ? (
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    <Table<TopSpender>
                      dataSource={topSpenders}
                      pagination={false}
                      size="small"
                      rowKey="userId"
                      columns={[
                        {
                          title: '#',
                          key: 'rank',
                          width: 50,
                          align: 'center',
                          render: (_, __, index) => {
                            if (index === 0)
                              return (
                                <Tag
                                  color="gold"
                                  style={{ fontWeight: 'bold' }}
                                >
                                  🥇
                                </Tag>
                              );
                            if (index === 1)
                              return (
                                <Tag
                                  color="silver"
                                  style={{ fontWeight: 'bold' }}
                                >
                                  🥈
                                </Tag>
                              );
                            if (index === 2)
                              return (
                                <Tag
                                  color="orange"
                                  style={{ fontWeight: 'bold' }}
                                >
                                  🥉
                                </Tag>
                              );
                            return (
                              <span style={{ color: '#8c8c8c' }}>
                                {index + 1}
                              </span>
                            );
                          },
                        },
                        {
                          title: 'Người dùng',
                          key: 'user',
                          render: (_, record) => (
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <Avatar
                                size={32}
                                icon={<UserOutlined />}
                                style={{
                                  backgroundColor: '#1890ff',
                                  marginRight: '8px',
                                }}
                              />
                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontWeight: 500,
                                    fontSize: '13px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {record.userName}
                                </div>
                                <div
                                  style={{
                                    fontSize: '11px',
                                    color: '#8c8c8c',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {record.email}
                                </div>
                              </div>
                            </div>
                          ),
                        },
                        {
                          title: 'Tổng chi',
                          key: 'total',
                          align: 'right',
                          width: 100,
                          render: (_, record) => (
                            <span
                              style={{
                                fontWeight: 600,
                                color: '#52c41a',
                                fontSize: '13px',
                              }}
                            >
                              {new Intl.NumberFormat('vi-VN').format(
                                record.total
                              )}
                              ₫
                            </span>
                          ),
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <Empty description="Không có dữ liệu" />
                )}
              </Card>
            </Col>
          </Row>

          {/* Yearly Revenue Chart */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title={<span>📉 Doanh thu theo năm</span>} bordered={false}>
                {yearChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={yearChartData}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ffc658"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ffc658"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis
                        tickFormatter={(value) =>
                          `${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          'Doanh thu',
                        ]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#ffc658"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        name="Doanh thu (VNĐ)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="Không có dữ liệu" />
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
