import React, { useState } from 'react';

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface AIAssistantPageProps {
  onNavigate?: (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup'
  ) => void;
}

const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ onNavigate: _ }) => {
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

  const quickQuestions = [
    'Tôi nên chọn nghề gì phù hợp với bản thân?',
    'Làm thế nào để phát triển kỹ năng lập trình?',
    'Cách chuẩn bị cho buổi phỏng vấn xin việc?',
    'Roadmap để trở thành Data Scientist?',
    'Tôi có nên chuyển nghề không?',
    'Kỹ năng soft skill quan trọng nào cần có?',
  ];

  const handleSendMessage = () => {
    if (userInput.trim() === '') return;

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(userInput),
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setUserInput('');
  };

  const getAIResponse = (input: string): string => {
    const responses = {
      nghề: 'Để chọn nghề phù hợp, bạn nên làm bài test RIASEC để hiểu rõ tính cách và sở thích của mình. Sau đó, tham khảo các roadmap nghề nghiệp trên CareerSpark để có định hướng cụ thể.',
      kỹ: 'Phát triển kỹ năng đòi hỏi sự kiên trì và luyện tập thường xuyên. Tôi khuyên bạn nên:\n\n1. Xác định kỹ năng cần thiết cho mục tiêu nghề nghiệp\n2. Lập kế hoạch học tập cụ thể\n3. Thực hành thông qua dự án thực tế\n4. Tham gia cộng đồng để học hỏi kinh nghiệm',
      phỏng:
        'Chuẩn bị phỏng vấn hiệu quả:\n\n• Nghiên cứu kỹ về công ty và vị trí ứng tuyển\n• Chuẩn bị câu trả lời cho các câu hỏi phổ biến\n• Luyện tập trình bày bản thân và kinh nghiệm\n• Chuẩn bị câu hỏi để hỏi lại nhà tuyển dụng\n• Dress code phù hợp và đến đúng giờ',
      default:
        'Đây là một câu hỏi rất hay! Tôi khuyên bạn nên làm bài test RIASEC trước để hiểu rõ hơn về bản thân. Sau đó, hãy tham khảo các roadmap nghề nghiệp và tham gia diễn đàn để trao đổi với cộng đồng.',
    };

    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('nghề')) return responses.nghề;
    if (lowerInput.includes('kỹ') || lowerInput.includes('skill'))
      return responses.kỹ;
    if (lowerInput.includes('phỏng vấn')) return responses.phỏng;
    return responses.default;
  };

  const handleQuickQuestion = (question: string) => {
    setUserInput(question);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trợ lý AI thông minh giúp bạn định hướng nghề nghiệp, phát triển
              kỹ năng và đạt được mục tiêu sự nghiệp
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="flex h-96">
              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        AI Assistant
                      </h3>
                      <p className="text-sm text-green-600">● Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
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

                {/* Input */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập câu hỏi về nghề nghiệp..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Questions Sidebar */}
              <div className="w-80 bg-gray-50 border-l p-4">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Câu hỏi gợi ý
                </h4>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="w-full text-left p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
                    >
                      {question}
                    </button>
                  ))}
                </div>

                {/* Features */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Tính năng hỗ trợ
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Tư vấn nghề nghiệp 24/7
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Phân tích RIASEC
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Roadmap cá nhân hóa
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Chuẩn bị phỏng vấn
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Test RIASEC</h3>
              <p className="text-gray-600 text-sm mb-4">
                Khám phá tính cách nghề nghiệp của bạn với bài test khoa học
              </p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                Làm bài test →
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">🗺️</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Roadmap</h3>
              <p className="text-gray-600 text-sm mb-4">
                Lộ trình phát triển sự nghiệp chi tiết cho từng ngành
              </p>
              <button className="text-green-600 text-sm font-medium hover:text-green-700">
                Xem roadmap →
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">💬</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Diễn đàn</h3>
              <p className="text-gray-600 text-sm mb-4">
                Tham gia cộng đồng để trao đổi kinh nghiệm nghề nghiệp
              </p>
              <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                Tham gia →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
