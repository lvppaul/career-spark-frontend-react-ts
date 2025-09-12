import React from 'react';
import ProtectedRoute from './ProtectedRoute';

interface RouteProps {
  children: React.ReactNode;
  allowHigherRoles?: boolean;
  redirectTo?: string;
  unauthorizedRedirect?: string;
}

// Helper component for Admin-only routes
export const AdminRoute: React.FC<RouteProps> = (props) => (
  <ProtectedRoute {...props} requiredRole="Admin" />
);

// Helper component for User-level routes (allows both User and Admin)
export const UserRoute: React.FC<RouteProps> = (props) => (
  <ProtectedRoute {...props} requiredRole="User" />
);
