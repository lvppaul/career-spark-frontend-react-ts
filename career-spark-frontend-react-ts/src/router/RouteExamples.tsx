// Example usage of ProtectedRoute, AdminRoute, UserRoute

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AdminRoute, UserRoute } from './RoleBasedRoutes';
import { usePermissions } from './authUtils';

// Import your page components
import HomePage from '../features/user/home/pages/HomePage';
import AdminPage from '../features/admin/pages/AdminPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import LoginPage from '../features/auth/pages/LoginPage';

// Example: Route Configuration
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected routes - any authenticated user */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* User-level routes (accessible by User and Admin) */}
      <Route
        path="/dashboard"
        element={
          <UserRoute>
            <UserDashboard />
          </UserRoute>
        }
      />

      {/* Admin-only routes */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />

      {/* Example: Custom redirect paths */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute
            requiredRole="Admin"
            redirectTo="/auth/login"
            unauthorizedRedirect="/dashboard"
          >
            <AdminSettings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// Example: Using the usePermissions hook in components
export const ExamplePermissionsComponent = () => {
  const {
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    canAccessAdminFeatures,
    hasRole,
    hasMinimumRole,
  } = usePermissions();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Your role: {user?.Role}</p>

      {/* Conditional rendering based on roles */}
      {isAdmin() && (
        <div>
          <h2>Admin Panel</h2>
          <button>Manage Users</button>
          <button>System Settings</button>
        </div>
      )}

      {isUser() && (
        <div>
          <h2>User Dashboard</h2>
          <button>View Profile</button>
          <button>Update Settings</button>
        </div>
      )}

      {/* Check specific permissions */}
      {hasRole('Admin') && <AdminOnlyButton />}
      {hasMinimumRole('User') && <UserAndAboveContent />}
      {canAccessAdminFeatures() && <AdminFeatures />}
    </div>
  );
};

// Example: HOC usage (if needed)
/*
import { withRoleProtection } from './authUtils';

const AdminOnlyComponent = () => {
  return <div>This is only visible to admins</div>;
};

// Wrap component with role protection
const ProtectedAdminComponent = withRoleProtection(
  AdminOnlyComponent, 
  'Admin',
  {
    redirectTo: '/auth/login',
    unauthorizedRedirect: '/dashboard'
  }
);
*/

// Example: Nested routes with different protection levels
export const UserRoutes = () => {
  return (
    <Routes>
      {/* Base user route */}
      <Route
        path="/"
        element={
          <UserRoute>
            <UserDashboard />
          </UserRoute>
        }
      >
        {/* Nested routes - all require User role minimum */}
        <Route path="profile" element={<UserProfile />} />
        <Route path="settings" element={<UserSettings />} />

        {/* Admin-only nested route */}
        <Route
          path="admin-panel"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};

// Placeholder components for examples
const AdminSettings = () => <div>Admin Settings</div>;
const UserDashboard = () => <div>User Dashboard</div>;
const UserProfile = () => <div>User Profile</div>;
const UserSettings = () => <div>User Settings</div>;
const AdminPanel = () => <div>Admin Panel</div>;
const AdminOnlyButton = () => <button>Admin Only Action</button>;
const UserAndAboveContent = () => <div>Content for Users and Admins</div>;
const AdminFeatures = () => <div>Admin Features</div>;

export default AppRoutes;
