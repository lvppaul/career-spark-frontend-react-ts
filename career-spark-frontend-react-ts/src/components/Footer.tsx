import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-semibold">CareerPath</span>
            </div>
            <p className="text-gray-400 mb-4">
              Nền tảng hướng nghiệp hàng đầu Việt Nam, giúp bạn khám phá tiềm
              năng và xây dựng sự nghiệp thành công.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                📘
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                📺
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                📷
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Test RIASEC
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Diễn Đàn
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tin Tức Nghề Nghiệp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Hỗ Trợ AI
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch Vụ</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Đánh giá tính cách
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Roadmap cá nhân hóa
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tư vấn nghề nghiệp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cộng đồng chuyên nghiệp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span className="text-gray-400">support@careerpath.vn</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span className="text-gray-400">+84 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span className="text-gray-400">Hà Nội, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 CareerPath. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
