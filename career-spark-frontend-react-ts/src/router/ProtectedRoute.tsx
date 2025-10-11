import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getDefaultRouteByRole } from './constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'User' | 'Admin' | 'Moderator';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, hasRole, isLoading, getUserRole } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', {
    currentPath: location.pathname,
    isAuthenticated,
    requiredRole,
    isLoading,
    userRole: getUserRole(),
  });

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute: showing loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Allow anonymous users to view the public homepage (/) even when the
    // surrounding route uses ProtectedRoute for user routes. This makes the
    // app default page accessible without login while keeping other nested
    // user routes protected.
    if (requiredRole === 'User' && location.pathname === '/') {
      console.log(
        'ProtectedRoute: not authenticated but on /, allowing public Home page'
      );
      return <>{children}</>;
    }

    console.log('ProtectedRoute: not authenticated, redirecting to login');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRole && !hasRole(requiredRole)) {
    // Instead of unauthorized page, redirect to appropriate dashboard based on current role
    const currentUserRole = getUserRole();
    const redirectPath = getDefaultRouteByRole(currentUserRole);
    console.log('ProtectedRoute: role mismatch, redirecting to:', redirectPath);
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: access granted, rendering children');
  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
