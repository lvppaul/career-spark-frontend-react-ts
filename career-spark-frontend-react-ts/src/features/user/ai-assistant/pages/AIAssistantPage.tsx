import React, { useRef, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Avatar,
  Input,
  Button,
  List,
  Tag,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  RobotOutlined,
  UserOutlined,
  SendOutlined,
  BulbOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

type ChatMessage = {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
};

const examplePrompts = [
  'Tôi nên chọn nghề gì dựa trên kỹ năng và sở thích?',
  'Roadmap để trở thành Data Scientist là gì?',
  'Lời khuyên để chuẩn bị phỏng vấn vị trí front-end',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'ai',
      content:
        'Chào bạn! Mình là AI Assistant của CareerSpark — mình có thể giúp tư vấn nghề nghiệp, lập roadmap học tập và chuẩn bị phỏng vấn. Hãy bắt đầu bằng cách hỏi một câu nhé.',
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, 100);
  };

  const send = (text?: string) => {
    const content = text ?? input;
    if (!content || !content.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    scrollToBottom();

    // Simulate AI response (placeholder)
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: generateAiReply(content),
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((m) => [...m, aiMsg]);
      scrollToBottom();
    }, 800);
  };

  const generateAiReply = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('đường') || t.includes('roadmap') || t.includes('lộ trình'))
      return 'Đây là roadmap gợi ý: bắt đầu từ cơ bản, học công cụ, thực hành qua dự án, rồi xây dựng portfolio.';
    if (t.includes('phỏng') || t.includes('phỏng vấn'))
      return 'Chuẩn bị phỏng vấn: luyện câu hỏi hành vi, kỹ thuật và demo project.';
    if (t.includes('nghề'))
      return 'Để chọn nghề, bạn nên cân nhắc sở thích, kỹ năng và thị trường lao động. Hãy thử làm test RIASEC.';
    return 'Mình đang phân tích... (đây là phản hồi demo). Bạn muốn rõ hơn về điểm nào?';
  };

  return (
    <div style={{ padding: 24, background: '#f6fbff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>
            Chuyên gia nghề nghiệp (AI Assistant)
          </Title>
          <Text type="secondary">
            Hỏi & nhận gợi ý về nghề nghiệp, lộ trình và kỹ năng
          </Text>
        </div>

        <Row gutter={16}>
          <Col xs={24} md={16}>
            <Card style={{ borderRadius: 12 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <Avatar
                  size={48}
                  icon={<RobotOutlined />}
                  style={{ background: '#096dd9' }}
                />
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    AI Career Assistant
                  </Title>
                  <Text type="success">● Online</Text>
                </div>
              </div>

              {/* Flex column layout: messages (scrollable) + input row + wrapped example prompts */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '60vh',
                }}
              >
                <div
                  ref={listRef}
                  style={{ flex: 1, overflowY: 'auto', padding: 8 }}
                >
                  <List
                    dataSource={messages}
                    renderItem={(msg) => (
                      <List.Item style={{ display: 'block', marginBottom: 8 }}>
                        <div
                          style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'flex-start',
                            justifyContent:
                              msg.role === 'user' ? 'flex-end' : 'flex-start',
                          }}
                        >
                          {msg.role === 'ai' && (
                            <Avatar icon={<RobotOutlined />} />
                          )}
                          <div style={{ maxWidth: '78%' }}>
                            <div
                              style={{
                                background:
                                  msg.role === 'user' ? '#096dd9' : '#fff',
                                color: msg.role === 'user' ? '#fff' : '#111',
                                padding: 12,
                                borderRadius: 8,
                                boxShadow: '0 1px 6px rgba(16,24,40,0.06)',
                              }}
                            >
                              <div style={{ whiteSpace: 'pre-line' }}>
                                {msg.content}
                              </div>
                            </div>
                            <div
                              style={{
                                marginTop: 6,
                                textAlign:
                                  msg.role === 'user' ? 'right' : 'left',
                              }}
                            >
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {msg.timestamp}
                              </Text>
                            </div>
                          </div>
                          {msg.role === 'user' && (
                            <Avatar icon={<UserOutlined />} />
                          )}
                        </div>
                      </List.Item>
                    )}
                  />
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div
                  style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}
                >
                  <TextArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Nhập câu hỏi hoặc mô tả mục tiêu nghề nghiệp của bạn..."
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => send()}
                  >
                    Gửi
                  </Button>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {examplePrompts.map((p) => (
                      <Tag
                        key={p}
                        color="blue"
                        onClick={() => send(p)}
                        style={{ cursor: 'pointer' }}
                      >
                        <BulbOutlined /> {p}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Card style={{ borderRadius: 12 }}>
                <Title level={5}>Câu hỏi gợi ý</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {[
                    'Tôi nên chọn nghề gì?',
                    'Roadmap cho Data Scientist?',
                    'Chuẩn bị phỏng vấn như thế nào?',
                  ].map((q) => (
                    <Button
                      key={q}
                      type="text"
                      onClick={() => send(q)}
                      style={{ textAlign: 'left', padding: 8, borderRadius: 8 }}
                    >
                      {q}
                    </Button>
                  ))}
                </Space>
              </Card>

              <Card style={{ borderRadius: 12 }}>
                <Title level={5}>Tính năng</Title>
                <Space direction="vertical">
                  <Text>• Tư vấn nghề nghiệp 24/7</Text>
                  <Text>• Roadmap & khóa học gợi ý</Text>
                  <Text>• Hướng dẫn CV & phỏng vấn</Text>
                </Space>
              </Card>

              <Card style={{ borderRadius: 12 }}>
                <Title level={5}>Tài nguyên</Title>
                <Space direction="vertical">
                  <Button type="link">Làm bài test RIASEC</Button>
                  <Button type="link">Xem Roadmap</Button>
                  <Button type="link">Tham gia diễn đàn</Button>
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
