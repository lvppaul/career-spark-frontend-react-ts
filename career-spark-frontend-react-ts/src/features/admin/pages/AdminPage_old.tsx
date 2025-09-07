import React, { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import UserManagement from '../components/UserManagement';
import QuestionManagement from '../components/QuestionManagement';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

type AdminView = 'dashboard' | 'user-management' | 'question-management';

const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Bảng điều khiển',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0"
          />
        </svg>
      ),
    },
    {
      id: 'user-management',
      label: 'Quản lý người dùng',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      id: 'question-management',
      label: 'Quản lý câu hỏi',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const handleNavigation = (page: string) => {
    setCurrentView(page as AdminView);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'user-management':
        return <UserManagement onNavigate={handleNavigation} />;
      case 'question-management':
        return <QuestionManagement onNavigate={handleNavigation} />;
      default:
        return <AdminDashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Career Spark Admin
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Admin Panel</span>
              <button
                onClick={() => onNavigate('home')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentView(item.id as AdminView)}
                    className={`w-full flex items-center px-4 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="mt-8 px-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Thống kê nhanh
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Người dùng online:</span>
                  <span className="font-medium text-green-600">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bài test hôm nay:</span>
                  <span className="font-medium text-blue-600">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Câu hỏi active:</span>
                  <span className="font-medium text-purple-600">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPage;
