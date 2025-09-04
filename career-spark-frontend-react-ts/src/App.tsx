import { useState } from 'react';
import { HomePage } from './features/home/pages';
import { LoginPage } from './features/auth/pages';
import { SignUpPage } from './features/auth/pages';
import { ForumPage } from './features/forum/pages';
import { NewsPage } from './features/news/pages';
import { AIAssistantPage } from './features/ai-assistant/pages';
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
      case 'admin':
        return <AdminPage onNavigate={handleNavigation} />;
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
