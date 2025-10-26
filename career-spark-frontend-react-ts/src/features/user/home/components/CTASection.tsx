import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Sẵn Sàng Khám Phá Sự Nghiệp Của Bạn?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Hãy bắt đầu hành trình khám phá bản thân và xây dựng sự nghiệp thành
          công ngay hôm nay
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/test-riasec')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Bắt Đầu Test Ngay →
          </button>
          <button
            onClick={() => navigate('/forum')}
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Tham Gia Cộng Đồng
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
