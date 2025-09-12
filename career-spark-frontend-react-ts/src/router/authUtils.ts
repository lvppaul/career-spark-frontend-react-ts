import { useSelector } from 'react-redux';
import type { RootState } from '../lib/store';

// Define role hierarchy for permission checking
export const ROLE_HIERARCHY = {
  Admin: 1,
  User: 2,
} as const;

export type UserRole = keyof typeof ROLE_HIERARCHY;

// Hook for checking user permissions
export const usePermissions = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const hasRole = (role: UserRole): boolean => {
    if (!isAuthenticated || !user) return false;
    return user.Role === role;
  };

  const hasMinimumRole = (minimumRole: UserRole): boolean => {
    if (!isAuthenticated || !user) return false;
    const userRoleLevel = ROLE_HIERARCHY[user.Role as UserRole];
    const minimumRoleLevel = ROLE_HIERARCHY[minimumRole];
    return userRoleLevel >= minimumRoleLevel;
  };

  const isAdmin = (): boolean => hasRole('Admin');
  const isUser = (): boolean => hasRole('User');
  const canAccessAdminFeatures = (): boolean => hasMinimumRole('Admin');

  return {
    user,
    isAuthenticated,
    hasRole,
    hasMinimumRole,
    isAdmin,
    isUser,
    canAccessAdminFeatures,
  };
};
