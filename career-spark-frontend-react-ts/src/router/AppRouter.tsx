import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { MainLayout, AdminLayout, AdminSidebar } from '@/layout';
import { HomePage } from '@/features/user/home/pages';
import { LoginPage, SignUpPage } from '@/features/auth/pages';
import { ForumPage } from '@/features/user/forum/pages';
import { NewsPage } from '@/features/user/news/pages';
import { AIAssistantPage } from '@/features/user/ai-assistant/pages';
import { AdminPage } from '@/features/admin/pages';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './constants';

// Wrapper components for layouts
const UserLayoutWrapper: React.FC = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const AdminLayoutWrapper: React.FC = () => (
  <AdminLayout sidebar={<AdminSidebar />}>
    <Outlet />
  </AdminLayout>
);

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminLayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPage />} />
          {/* Add more admin routes as needed */}
          {/* <Route path="users" element={<UserManagementPage />} /> */}
          {/* <Route path="questions" element={<QuestionManagementPage />} /> */}
          {/* <Route path="settings" element={<AdminSettingsPage />} /> */}
        </Route>

        {/* Protected User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="User">
              <UserLayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="ai-assistant" element={<AIAssistantPage />} />
          {/* Add roadmap route when component is ready */}
          {/* <Route path="roadmap" element={<RoadmapPage />} /> */}
        </Route>

        {/* Fallback route - redirect any unmatched routes */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
