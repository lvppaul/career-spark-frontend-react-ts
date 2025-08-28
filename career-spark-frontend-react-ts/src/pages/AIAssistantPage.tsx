import React, { useState } from 'react';
import { Header, Footer } from '@/components/shared';

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface AIAssistantPageProps {
  onNavigate?: (page: 'home' | 'login' | 'forum' | 'news' | 'ai') => void;
}

const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ onNavigate }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      content:
        'Chào bạn! Tôi là AI Assistant của CareerSpark, chuyên tư vấn về nghề nghiệp và phát triển sự nghiệp. Tôi có thể giúp bạn với:\n\n• Tư vấn lựa chọn nghề nghiệp\n• Hướng dẫn phát triển kỹ năng\n• Tìm kiếm cơ hội việc làm\n• Lập kế hoạch sự nghiệp\n• Chuẩn bị phỏng vấn\n\nBạn có câu hỏi gì về sự nghiệp không?',
      timestamp: '10:30',
    },
  ]);

  const todayStats = [
    { label: 'Câu hỏi đã xử lý', value: '1,234', color: 'text-blue-600' },
    { label: 'Người dùng truy cập', value: '456', color: 'text-green-600' },
    { label: 'CV đã tạo', value: '89', color: 'text-purple-600' },
  ];

  const hotTopics = [
    'Chuyển ngành nghề IT',
    'Cách viết CV ấn tượng',
    'Phát triển kỹ năng',
  ];

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = {
      id: messages.length + 1,
      type: 'user',
      content: userInput,
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        type: 'ai',
        content:
          'Cảm ơn bạn đã đặt câu hỏi! Tôi đang xử lý thông tin và sẽ trả lời bạn trong giây lát. Đây là phản hồi mẫu để demo chức năng chat.',
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="ai" onNavigate={onNavigate} />

      {/* Header section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">AI</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                AI Career Assistant
              </h1>
            </div>
            <p className="text-gray-600">
              Trợ lý AI thông minh hỗ trợ bạn phát triển sự nghiệp
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">AI</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        CareerSpark AI Assistant
                      </h3>
                      <p className="text-sm text-blue-100">Đang hoạt động</p>
                    </div>
                  </div>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Online
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.type === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập câu hỏi của bạn về nghề nghiệp..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Gửi
                  </button>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="bg-gray-50 p-4 border-t">
                <p className="text-sm text-gray-600 mb-3">Gợi ý câu hỏi:</p>
                <div className="flex flex-wrap gap-2">
                  <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors">
                    Nghề nghiệp phù hợp với tôi
                  </button>
                  <button className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors">
                    Cải thiện CV của tôi
                  </button>
                  <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
                    Chuẩn bị phỏng vấn
                  </button>
                  <button className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm hover:bg-orange-200 transition-colors">
                    Chuyển đổi sự nghiệp
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* AI Features */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                ⚡ Tính Năng AI
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">
                    Tự động tạo CV chuyên nghiệp
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">
                    Câu hỏi truy cập tư vấn nghề
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>

            {/* AI Premium */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-4 text-white mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👑</span>
                <h3 className="font-semibold">AI Premium</h3>
              </div>
              <p className="text-sm text-orange-100 mb-3">
                Nâng cấp để trải nghiệm đầy đủ tính năng AI cao cấp
              </p>
              <button className="w-full bg-white text-orange-600 py-2 rounded font-medium text-sm hover:bg-orange-50 transition-colors">
                Nâng cấp ngay
              </button>
            </div>

            {/* Today Stats */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                📊 Thống Kê Hôm Nay
              </h3>
              <div className="space-y-3">
                {todayStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <span className={`font-semibold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hot Topics */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                🔥 Chủ Đề Hot
              </h3>
              <div className="space-y-3">
                {hotTopics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xs">🔥</span>
                    </div>
                    <span className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">
                      {topic}
                    </span>
                  </div>
                ))}
                <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                  Xem tất cả chủ đề →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIAssistantPage;
