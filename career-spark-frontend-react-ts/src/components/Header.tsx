import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollVisibility } from '../hooks/useScrollDirection';
import { useAuth } from '../features/auth/hooks/useAuth';

const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  // Hook để theo dõi scroll và hiển thị/ẩn header
  const isHeaderVisible = useScrollVisibility(50);

  const handleLogout = async () => {
    await logout();
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
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
            <Link
              to="/"
              className={`text-gray-600 hover:text-blue-600 transition-colors ${
                isActivePath('/') ? 'text-blue-600 font-medium' : ''
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/forum"
              className={`text-gray-600 hover:text-blue-600 transition-colors ${
                isActivePath('/forum') ? 'text-blue-600 font-medium' : ''
              }`}
            >
              Diễn đàn
            </Link>
            <Link
              to="/news"
              className={`text-gray-600 hover:text-blue-600 transition-colors ${
                isActivePath('/news') ? 'text-blue-600 font-medium' : ''
              }`}
            >
              Tin tức
            </Link>
            <Link
              to="/ai-assistant"
              className={`text-gray-600 hover:text-blue-600 transition-colors ${
                isActivePath('/ai-assistant') ? 'text-blue-600 font-medium' : ''
              }`}
            >
              AI Assistant
            </Link>
            <Link
              to="/admin"
              className={`text-gray-600 hover:text-blue-600 transition-colors ${
                isActivePath('/admin') ? 'text-blue-600 font-medium' : ''
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
