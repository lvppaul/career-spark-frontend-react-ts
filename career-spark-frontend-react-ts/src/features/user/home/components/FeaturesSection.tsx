import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturesSection: React.FC = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: '🧪',
      title: 'Test RIASEC',
      description:
        'Khám phá tính cách và nghề nghiệp phù hợp qua bài test khoa học',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: '👥',
      title: 'Diễn Đàn Cộng Đồng',
      description: 'Kết nối và chia sẻ kinh nghiệm với hàng ngàn thành viên',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: '📰',
      title: 'Tin Tức Nghề Nghiệp',
      description: 'Cập nhật thông tin mới nhất về thị trường việc làm',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: '🤖',
      title: 'Hỗ Trợ AI',
      description:
        'Tư vấn tức thì với AI thông minh về mọi thắc mắc nghề nghiệp',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tính Năng Nổi Bật
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các công cụ mạnh mẽ giúp bạn định hướng nghề nghiệp hiệu
            quả
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            // map feature title to route
            const route = feature.title.includes('RIASEC')
              ? '/test-riasec'
              : feature.title.includes('Diễn Đàn')
                ? '/forum'
                : feature.title.includes('Tin Tức')
                  ? '/news'
                  : '/ai-assistant';

            return (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => navigate(route)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') navigate(route);
                }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div
                  className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-4`}
                >
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
