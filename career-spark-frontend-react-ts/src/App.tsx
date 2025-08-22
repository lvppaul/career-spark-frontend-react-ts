import { useState } from 'react';
import { HomePage, LoginPage } from './pages';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login'>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'home':
      default:
        return <HomePage />;
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
      </div>

      {renderPage()}
    </div>
  );
}

export default App;
