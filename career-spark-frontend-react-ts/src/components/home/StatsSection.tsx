import React from 'react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: '👥',
      number: '50K+',
      label: 'Người dùng',
    },
    {
      icon: '🧪',
      number: '10K+',
      label: 'Bài test hoàn thành',
    },
    {
      icon: '💬',
      number: '5K+',
      label: 'Thảo luận diễn đàn',
    },
    {
      icon: '⭐',
      number: '98%',
      label: 'Độ hài lòng',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
