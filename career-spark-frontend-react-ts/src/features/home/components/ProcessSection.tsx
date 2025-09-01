import React from 'react';

const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Làm Test RIASEC',
      description:
        'Hoàn thành bài test tính cách khoa học để hiểu rõ về bản thân',
      color: 'bg-blue-500',
    },
    {
      number: '2',
      title: 'Nhận Kết Quả',
      description: 'Xem phân tích chi tiết về tính cách và nghề nghiệp phù hợp',
      color: 'bg-green-500',
    },
    {
      number: '3',
      title: 'Phát Triển Sự Nghiệp',
      description: 'Theo roadmap cá nhân hóa và kết nối với cộng đồng',
      color: 'bg-purple-500',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Cách Thức Hoạt Động
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Quy trình đơn giản để khám phá và phát triển sự nghiệp của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <span className="text-white text-2xl font-bold">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
