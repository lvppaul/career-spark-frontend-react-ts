import { useState } from 'react';
import { MainLayout } from './layout';
import { HomePage } from './features/user/home/pages';
import { LoginPage } from './features/auth/pages';
import { SignUpPage } from './features/auth/pages';
import { ForumPage } from '@/features/user/forum/pages';
import { NewsPage } from '@/features/user/news/pages';
import { AIAssistantPage } from '@/features/user/ai-assistant/pages';
import { AdminPage } from './features/admin/pages';

function App() {
  const [currentPage, setCurrentPage] = useState<
    'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup' | 'admin'
  >('home');

  const handleNavigation = (page: string) => {
    setCurrentPage(
      page as 'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup' | 'admin'
    );
  };

  const renderPage = () => {
    // Admin pages sử dụng layout riêng
    if (currentPage === 'admin') {
      return <AdminPage onNavigate={handleNavigation} />;
    }

    // Các page khác sử dụng MainLayout
    const content = (() => {
      switch (currentPage) {
        case 'login':
          return <LoginPage onNavigate={handleNavigation} />;
        case 'signup':
          return <SignUpPage onNavigate={handleNavigation} />;
        case 'forum':
          return <ForumPage onNavigate={handleNavigation} />;
        case 'news':
          return <NewsPage onNavigate={handleNavigation} />;
        case 'ai':
          return <AIAssistantPage onNavigate={handleNavigation} />;
        case 'home':
        default:
          return <HomePage onNavigate={handleNavigation} />;
      }
    })();

    return (
      <MainLayout currentPage={currentPage} onNavigate={handleNavigation}>
        {content}
      </MainLayout>
    );
  };

  return <div>{renderPage()}</div>;
}

export default App;
