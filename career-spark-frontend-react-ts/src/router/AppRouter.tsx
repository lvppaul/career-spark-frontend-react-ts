import UserManagement from '@/features/admin/components/UserManagement';
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
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import ConfirmEmailPage from '@/features/auth/pages/ConfirmEmailPage';
import { ForumPage } from '@/features/user/forum/pages';
import { NewsPage } from '@/features/user/news/pages';
const NewsDetailPage = React.lazy(
  () => import('@/features/user/news/pages/NewsDetailPage')
);
import { AdminPage } from '@/features/admin/pages';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './constants';
import UserProfileView from '@/features/user/user-management/pages/UserProfileView';
import UserProfileEdit from '@/features/user/user-management/pages/UserProfileEdit';
import UserSettingsPage from '@/features/user/user-management/pages/UserSettingsPage';

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
const BlogsPageLazy = React.lazy(
  () => import('@/features/admin/pages/BlogsPage')
);
const UnpublishedBlogsPageLazy = React.lazy(
  () => import('@/features/admin/pages/UnpublishedBlogsPage')
);
const NewsManagementPageLazy = React.lazy(
  () => import('@/features/admin/pages/NewsManagementPage')
);
const SubscriptionPlansPageLazy = React.lazy(
  () => import('@/features/admin/pages/SubscriptionPlansPage')
);
const OrdersPageLazy = React.lazy(
  () => import('@/features/admin/pages/OrdersPage')
);

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
        <Route path={ROUTES.CONFIRM_EMAIL} element={<ConfirmEmailPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
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
          <Route
            path="users"
            element={<UserManagement onNavigate={() => {}} />}
          />
          {/* Add more admin routes as needed */}
          {/* <Route path="users" element={<UserManagementPage />} /> */}
          {/* <Route path="questions" element={<QuestionManagementPage />} /> */}
          <Route
            path="blogs"
            element={
              <Suspense fallback={<div>Đang tải...</div>}>
                <BlogsPageLazy />
              </Suspense>
            }
          />
          <Route
            path="blogs/unpublished"
            element={
              <Suspense fallback={<div>Đang tải...</div>}>
                <UnpublishedBlogsPageLazy />
              </Suspense>
            }
          />
          <Route
            path="news"
            element={
              <Suspense fallback={<div>Đang tải...</div>}>
                <NewsManagementPageLazy />
              </Suspense>
            }
          />
          <Route
            path="subscription-plans"
            element={
              <Suspense fallback={<div>Đang tải...</div>}>
                <SubscriptionPlansPageLazy />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense fallback={<div>Đang tải...</div>}>
                <OrdersPageLazy />
              </Suspense>
            }
          />
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
          <Route
            path="news/:id"
            element={
              <Suspense fallback={<div>Đang tải...</div>}>
                <NewsDetailPage />
              </Suspense>
            }
          />
          {/* AI Assistant route removed */}
          <Route path="test-riasec" element={<TestPage />} />
          <Route path="test-riasec/result" element={<RiasecResultPage />} />
          <Route path="test-riasec/history" element={<RiasecHistoryPage />} />
          <Route path="profile" element={<UserProfileView />} />
          <Route path="profile/edit/:id" element={<UserProfileEdit />} />
          <Route path="settings" element={<UserSettingsPage />} />
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
