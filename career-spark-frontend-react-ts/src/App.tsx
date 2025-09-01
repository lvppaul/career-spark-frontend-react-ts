import { useState } from 'react';
import { HomePage } from './features/home/pages';
import { LoginPage } from './features/auth/pages';
import { SignUpPage } from './features/auth/pages';
import { ForumPage } from './features/forum/pages';
import { NewsPage } from './features/news/pages';
import { AIAssistantPage } from './features/ai-assistant/pages';

function App() {
  const [currentPage, setCurrentPage] = useState<
    'home' | 'login' | 'forum' | 'news' | 'ai' | 'signup'
  >('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignUpPage onNavigate={setCurrentPage} />;
      case 'forum':
        return <ForumPage onNavigate={setCurrentPage} />;
      case 'news':
        return <NewsPage onNavigate={setCurrentPage} />;
      case 'ai':
        return <AIAssistantPage onNavigate={setCurrentPage} />;
      case 'home':
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;
