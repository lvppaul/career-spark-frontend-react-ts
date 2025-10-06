import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollVisibility } from '../hooks/useScrollDirection';
import { useAuth } from '../features/auth/hooks/useAuth';
import logoXX from '@/assets/images/only-logo-xx.jpg';
const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);
  const menuRef = useRef<HTMLDivElement>(null);

  // Hook để theo dõi scroll và hiển thị/ẩn header
  const isHeaderVisible = useScrollVisibility(50);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  // Use activePath state for instant highlight on click, but keep it in sync with location
  const isActivePath = (path: string) => {
    if (path === '/') return activePath === '/';
    return activePath.startsWith(path);
  };

  // Keep activePath synced when route changes externally (back/forward, direct nav)
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={logoXX}
              alt="CareerSpark Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-semibold text-gray-800">
            CareerSpark
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            onClick={() => setActivePath('/')}
            className={`transition-colors px-3 py-1 rounded-md ${
              isActivePath('/')
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Trang chủ
          </Link>
          <Link
            to="/forum"
            onClick={() => setActivePath('/forum')}
            className={`transition-colors px-3 py-1 rounded-md ${
              isActivePath('/forum')
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Diễn đàn
          </Link>
          <Link
            to="/news"
            onClick={() => setActivePath('/news')}
            className={`transition-colors px-3 py-1 rounded-md ${
              isActivePath('/news')
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Tin tức
          </Link>
          <Link
            to="/ai-assistant"
            onClick={() => setActivePath('/ai-assistant')}
            className={`transition-colors px-3 py-1 rounded-md ${
              isActivePath('/ai-assistant')
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            AI Assistant
          </Link>
          <Link
            to="/test-riasec"
            onClick={() => setActivePath('/test-riasec')}
            className={`transition-colors px-3 py-1 rounded-md ${
              isActivePath('/test-riasec')
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Test RIASEC
          </Link>
        </nav>

        {/* User Menu */}
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
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:block">{user?.name || 'User'}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user?.email || 'email@example.com'}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Cài đặt
                  </Link>
                  <Link
                    to="/test-riasec/history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Lịch sử
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
