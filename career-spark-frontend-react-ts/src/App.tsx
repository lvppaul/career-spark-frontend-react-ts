import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './lib/store';
import { MainLayout } from './layout';
import { HomePage } from './features/user/home/pages';
import { LoginPage } from './features/auth/pages';
import { SignUpPage } from './features/auth/pages';
import { ForumPage } from '@/features/user/forum/pages';
import { NewsPage } from '@/features/user/news/pages';
import { AIAssistantPage } from '@/features/user/ai-assistant/pages';
import { AdminPage } from './features/admin/pages';
import ProtectedRoute from './router/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />

          {/* Protected User Routes */}
          <Route
            path="/*"
            element={
              <MainLayout>
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route
                    path="forum"
                    element={
                      <ProtectedRoute requiredRole="User">
                        <ForumPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="news"
                    element={
                      <ProtectedRoute requiredRole="User">
                        <NewsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="ai-assistant"
                    element={
                      <ProtectedRoute requiredRole="User">
                        <AIAssistantPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </MainLayout>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unmatched routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
