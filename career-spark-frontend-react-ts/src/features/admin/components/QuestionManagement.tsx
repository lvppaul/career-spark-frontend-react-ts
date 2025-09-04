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
  Radio,
} from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type {
  RiasecQuestion,
  QuestionFilters,
} from '../../../types/admin';
import { demoQuestions } from '../../../data/demoData';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

interface QuestionManagementProps {
  onNavigate: (page: string) => void;
}

const QuestionManagement: React.FC<QuestionManagementProps> = ({ onNavigate: _ }) => {
  const [questions, setQuestions] = useState<RiasecQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [selectedQuestion, setSelectedQuestion] = useState<RiasecQuestion | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  const categories = [
    {
      value: 'realistic',
      label: 'Thực tế (R)',
      color: 'green',
      description: 'Làm việc với tay, máy móc, công cụ',
    },
    {
      value: 'investigative',
      label: 'Nghiên cứu (I)',
      color: 'blue',
      description: 'Tư duy, phân tích, nghiên cứu',
    },
    {
      value: 'artistic',
      label: 'Nghệ thuật (A)',
      color: 'purple',
      description: 'Sáng tạo, nghệ thuật, biểu đạt',
    },
    {
      value: 'social',
      label: 'Xã hội (S)',
      color: 'orange',
      description: 'Giúp đỡ, dạy dỗ, chăm sóc',
    },
    {
      value: 'enterprising',
      label: 'Khởi nghiệp (E)',
      color: 'red',
      description: 'Lãnh đạo, thuyết phục, kinh doanh',
    },
    {
      value: 'conventional',
      label: 'Truyền thống (C)',
      color: 'cyan',
      description: 'Tổ chức, quản lý, xử lý dữ liệu',
    },
  ];

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call with demo data
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredQuestions = [...demoQuestions];

      // Apply search filter
      if (searchText) {
        filteredQuestions = filteredQuestions.filter(
          question =>
            question.questionText.toLowerCase().includes(searchText.toLowerCase()) ||
            question.id.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      // Apply category filter
      if (filters.category) {
        filteredQuestions = filteredQuestions.filter(question => question.category === filters.category);
      }

      setQuestions(filteredQuestions);
    } catch (error) {
      message.error('Không thể tải danh sách câu hỏi');
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  }, [searchText, filters]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFilterChange = (key: keyof QuestionFilters, value: string | undefined) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    fetchQuestions();
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
      message.success('Xóa câu hỏi thành công');
    } catch (error) {
      message.error('Không thể xóa câu hỏi');
      console.error('Error deleting question:', error);
    }
  };

  const openEditModal = (question: RiasecQuestion) => {
    setSelectedQuestion(question);
    setIsEditMode(true);
    form.setFieldsValue(question);
    setIsModalVisible(true);
  };

  const openCreateModal = () => {
    setSelectedQuestion(null);
    setIsEditMode(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedQuestion(null);
    form.resetFields();
  };

  const handleSubmit = async (values: Partial<RiasecQuestion>) => {
    try {
      if (isEditMode && selectedQuestion) {
        // Update question
        setQuestions(prevQuestions =>
          prevQuestions.map(q =>
            q.id === selectedQuestion.id ? { ...q, ...values } : q
          )
        );
        message.success('Cập nhật câu hỏi thành công');
      } else {
        // Create new question
        const newQuestion: RiasecQuestion = {
          id: Date.now().toString(),
          questionText: values.questionText!,
          category: values.category!,
          type: 'scale',
          weight: 1,
          order: questions.length + 1,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setQuestions(prevQuestions => [newQuestion, ...prevQuestions]);
        message.success('Tạo câu hỏi thành công');
      }
      closeModal();
    } catch (error) {
      message.error('Không thể lưu câu hỏi');
      console.error('Error saving question:', error);
    }
  };

  const getCategoryTag = (category: string) => {
    const categoryConfig = categories.find(c => c.value === category);
    if (!categoryConfig) return <Tag>{category}</Tag>;
    
    return (
      <Tag color={categoryConfig.color}>
        {categoryConfig.label}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionText',
      key: 'questionText',
      render: (text: string) => (
        <div style={{ maxWidth: '300px' }}>
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => getCategoryTag(category),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: (a: RiasecQuestion, b: RiasecQuestion) => a.order - b.order,
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
      render: (_: string, record: RiasecQuestion) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              Modal.info({
                title: 'Chi tiết câu hỏi',
                content: (
                  <div>
                    <p><strong>ID:</strong> {record.id}</p>
                    <p><strong>Danh mục:</strong> {getCategoryTag(record.category)}</p>
                    <p><strong>Thứ tự:</strong> {record.order}</p>
                    <p><strong>Nội dung:</strong></p>
                    <p>{record.questionText}</p>
                  </div>
                ),
                width: 600,
              });
            }}
            size="small"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            size="small"
            type="primary"
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa câu hỏi này?"
            onConfirm={() => handleDeleteQuestion(record.id)}
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
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={2} style={{ margin: 0 }}>Quản lý câu hỏi RIASEC</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              size="large"
            >
              Thêm câu hỏi
            </Button>
          </div>

          <Divider />

          {/* Categories info */}
          <div style={{ marginBottom: '16px' }}>
            <Title level={4}>Danh mục RIASEC:</Title>
            <Row gutter={[16, 16]}>
              {categories.map(category => (
                <Col xs={24} sm={12} md={8} key={category.value}>
                  <Card size="small">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <Tag color={category.color}>{category.label}</Tag>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {category.description}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <Divider />

          {/* Filters */}
          <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Tìm kiếm câu hỏi..."
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Danh mục"
                allowClear
                style={{ width: '100%' }}
                onChange={(value) => handleFilterChange('category', value)}
              >
                {categories.map(category => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
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
          dataSource={questions}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} câu hỏi`,
          }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={isEditMode ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            label="Danh mục RIASEC"
            name="category"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Radio.Group>
              {categories.map(category => (
                <Radio.Button key={category.value} value={category.value}>
                  {category.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Nội dung câu hỏi"
            name="questionText"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung câu hỏi..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="Thứ tự"
            name="order"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

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

export default QuestionManagement;
