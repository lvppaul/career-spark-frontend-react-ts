import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollVisibility } from '../hooks/useScrollDirection';
import { useAuth } from '../features/auth/hooks/useAuth';
import logoXX from '@/assets/images/only-logo-xx.jpg';
const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Debug log
  console.log(
    'Header render - isAuthenticated:',
    isAuthenticated,
    'user:',
    user
  );
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
      className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white via-gray-50 to-blue-50 shadow-lg border-b border-gray-200 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full flex items-center justify-between h-16 px-6 md:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
            <img
              src={logoXX}
              alt="CareerSpark Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            <Link to="/">CareerSpark</Link>
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            onClick={() => setActivePath('/')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative flex items-center space-x-2 ${
              isActivePath('/')
                ? '!bg-blue-600 !text-white shadow-lg'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <span>🏠</span>
            <span>Trang chủ</span>
          </Link>
          <Link
            to="/forum"
            onClick={() => setActivePath('/forum')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative flex items-center space-x-2 ${
              isActivePath('/forum')
                ? '!bg-blue-600 !text-white shadow-lg'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <span>💬</span>
            <span>Diễn đàn</span>
          </Link>
          <Link
            to="/news"
            onClick={() => setActivePath('/news')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative flex items-center space-x-2 ${
              isActivePath('/news')
                ? '!bg-blue-600 !text-white shadow-lg'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <span>📰</span>
            <span>Tin tức</span>
          </Link>
          <Link
            to="/test-riasec"
            onClick={() => setActivePath('/test-riasec')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative flex items-center space-x-2 ${
              isActivePath('/test-riasec')
                ? '!bg-blue-600 !text-white shadow-lg'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <span>📊</span>
            <span>Test RIASEC</span>
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="flex items-center space-x-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300"
              >
                <span>Đăng nhập</span>
              </Link>
              <Link
                to="/signup"
                className="flex items-center space-x-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300"
              >
                <span>Đăng ký</span>
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
              >
                {user?.avatarURL ? (
                  <img
                    src={user.avatarURL}
                    alt={user.name ?? 'avatar'}
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-200 group-hover:border-blue-500 transition-all duration-300 shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-blue-300 group-hover:border-indigo-500 transition-all duration-300 shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="hidden md:block font-medium">
                  {user?.name || 'User'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
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
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 backdrop-blur-sm">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {user?.email || 'email@example.com'}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className={`block px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActivePath('/profile')
                        ? '!bg-blue-600 !text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    👤 Thông tin cá nhân
                  </Link>
                  <Link
                    to="/settings"
                    className={`block px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActivePath('/settings')
                        ? '!bg-blue-600 !text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    ⚙️ Cài đặt
                  </Link>
                  <Link
                    to="/matching-jobs"
                    className={`block px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActivePath('/matching-jobs')
                        ? '!bg-blue-600 !text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    🗺️ Roadmap cụ thể
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    🚪 Đăng xuất
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
