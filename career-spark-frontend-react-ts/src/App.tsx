import { useState } from 'react';
import {
  HomePage,
  LoginPage,
  SignUpPage,
  ForumPage,
  NewsPage,
  AIAssistantPage,
} from './pages';

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

  return (
    <div>
      {/* Temporary navigation for testing */}
      <div className="fixed top-4 right-4 z-50 space-x-2">
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
        >
          Home
        </button>
        <button
          onClick={() => setCurrentPage('login')}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Login
        </button>
        <button
          onClick={() => setCurrentPage('forum')}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
        >
          Forum
        </button>
        <button
          onClick={() => setCurrentPage('news')}
          className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
        >
          News
        </button>
        <button
          onClick={() => setCurrentPage('ai')}
          className="bg-indigo-500 text-white px-3 py-1 rounded text-sm"
        >
          AI
        </button>
      </div>

      {renderPage()}
    </div>
  );
}

export default App;
