import React, { useState } from 'react';

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup'
  ) => void;
}

const Header: React.FC<HeaderProps> = ({
  currentPage = 'home',
  onNavigate,
}) => {
  // State để quản lý trạng thái đăng nhập (có thể thay bằng context/redux sau)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigation = (
    page: 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup'
  ) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

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
            <button
              onClick={() => handleNavigation('home')}
              className={`font-medium transition-colors ${
                currentPage === 'home'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Trang chủ
            </button>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Test RIASEC
            </a>
            <button
              onClick={() => handleNavigation('forum')}
              className={`transition-colors ${
                currentPage === 'forum'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Diễn Đàn
            </button>
            <button
              onClick={() => handleNavigation('news')}
              className={`transition-colors ${
                currentPage === 'news'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Tin Tức
            </button>
            <button
              onClick={() => handleNavigation('ai')}
              className={`transition-colors ${
                currentPage === 'ai'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              AI Hỗ trợ
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {!isLoggedIn ? (
              // Trạng thái chưa đăng nhập
              <>
                <button
                  onClick={() => handleNavigation('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('signup')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            ) : (
              // Trạng thái đã đăng nhập
              <>
                <button className="flex items-center space-x-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                  <span>�</span>
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
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
