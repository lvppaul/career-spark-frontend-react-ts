import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { MainLayout, AdminLayout, AdminSidebar } from '@/layout';
import { HomePage } from '@/features/user/home/pages';
import { TestPage } from '@/features/user/test-riasec';
import RiasecResultPage from '@/features/user/test-riasec/pages/RiasecResultPage';
import RiasecHistoryPage from '@/features/user/test-riasec/pages/RiasecHistoryPage';
import { LoginPage, SignUpPage } from '@/features/auth/pages';
import { ForumPage } from '@/features/user/forum/pages';
import { NewsPage } from '@/features/user/news/pages';
import { AIAssistantPage } from '@/features/user/ai-assistant/pages';
import { AdminPage } from '@/features/admin/pages';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './constants';
import UserProfileView from '@/features/user/user-management/pages/UserProfileView';
import UserProfileEdit from '@/features/user/user-management/pages/UserProfileEdit';

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

const SubscriptionPage = React.lazy(
  () => import('@/features/subscription/pages/SubscriptionPage')
);
const PaymentResultPage = React.lazy(
  () => import('@/features/payment/pages/PaymentResultPage')
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

        {/* Public Home route (accessible without login) */}
        <Route path="/" element={<UserLayoutWrapper />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* Protected User Routes (other pages require authentication) */}
        <Route
          element={
            <ProtectedRoute requiredRole="User">
              <UserLayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route path="forum" element={<ForumPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="ai-assistant" element={<AIAssistantPage />} />
          <Route path="test-riasec" element={<TestPage />} />
          <Route path="test-riasec/result" element={<RiasecResultPage />} />
          <Route path="test-riasec/history" element={<RiasecHistoryPage />} />
          <Route path="profile" element={<UserProfileView />} />
          <Route path="profile/edit" element={<UserProfileEdit />} />
          <Route
            path="matching-jobs"
            element={
              <Suspense fallback={<div>Đang tải...</div>}>
                {React.createElement(
                  React.lazy(
                    () =>
                      import(
                        '@/features/user/test-riasec/pages/MatchingJobsPage'
                      )
                  )
                )}
              </Suspense>
            }
          />
          <Route
            path="subscription"
            element={
              <Suspense fallback={<div>Đang tải...</div>}>
                <SubscriptionPage />
              </Suspense>
            }
          />
          <Route
            path="payment/result"
            element={
              <Suspense fallback={<div>Đang tải...</div>}>
                <PaymentResultPage />
              </Suspense>
            }
          />
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
