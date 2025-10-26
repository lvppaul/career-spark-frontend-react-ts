import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Khám Phá Tiềm Năng
          <br />
          Xây Dựng Sự Nghiệp
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
          Nền tảng hướng nghiệp hàng đầu Việt Nam với test RIASEC khoa học,
          <br />
          roadmap cá nhân hóa và cộng đồng chuyên nghiệp
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/test-riasec')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Làm Test Miễn Phí →
          </button>
          <button
            onClick={() => navigate('/forum')}
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Tham Gia Diễn Đàn
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
