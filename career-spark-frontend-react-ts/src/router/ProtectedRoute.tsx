import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../lib/store';
import { ROLE_HIERARCHY, type UserRole } from './authUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Required role to access the route
   * - 'User': Regular user access
   * - 'Admin': Admin access only
   */
  requiredRole?: UserRole;
  /**
   * Allow access for users with higher roles than required
   * @default true
   */
  allowHigherRoles?: boolean;
  /**
   * Custom redirect path when not authenticated
   * @default '/auth/login'
   */
  redirectTo?: string;
  /**
   * Custom redirect path when insufficient permissions
   * @default '/unauthorized'
   */
  unauthorizedRedirect?: string;
}

/**
 * ProtectedRoute component for role-based access control
 *
 * Features:
 * - Authentication checking
 * - Role-based authorization
 * - Loading states handling
 * - Proper redirects with state preservation
 * - Hierarchical role system
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowHigherRoles = true,
  redirectTo = '/auth/login',
  unauthorizedRedirect = '/unauthorized',
}) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg">Đang kiểm tra quyền truy cập...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole) {
    const userRole = user.Role as UserRole;
    const userRoleLevel = ROLE_HIERARCHY[userRole];
    const requiredRoleLevel = ROLE_HIERARCHY[requiredRole];

    if (!userRoleLevel) {
      console.warn(`Unknown user role: ${userRole}`);
      return (
        <Navigate
          to={unauthorizedRedirect}
          state={{ from: location, reason: 'invalid_role' }}
          replace
        />
      );
    }

    // Check if user has sufficient permissions
    const hasPermission = allowHigherRoles
      ? userRoleLevel >= requiredRoleLevel
      : userRoleLevel === requiredRoleLevel;

    if (!hasPermission) {
      return (
        <Navigate
          to={unauthorizedRedirect}
          state={{
            from: location,
            reason: 'insufficient_permissions',
            requiredRole,
            userRole,
          }}
          replace
        />
      );
    }
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
