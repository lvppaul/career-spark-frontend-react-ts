import React, { useState } from 'react';

const Header: React.FC = () => {
  // State để quản lý trạng thái đăng nhập (có thể thay bằng context/redux sau)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-1">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src="/only-logo-xx.jpg"
                alt="CareerSpark Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-semibold text-gray-800">
              CareerSpark
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-blue-600 font-medium">
              Trang chủ
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Test RIASEC
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Diễn Đàn
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Tin Tức
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              AI Hỗ trợ
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {!isLoggedIn ? (
              // Trạng thái chưa đăng nhập - như ảnh đầu tiên
              <>
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tài Khoản
                </button>
              </>
            ) : (
              // Trạng thái đã đăng nhập - như ảnh thứ hai
              <>
                <button className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                  <span>🔍</span>
                  <span>Login</span>
                </button>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
