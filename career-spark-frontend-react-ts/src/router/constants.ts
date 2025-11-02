// Public routes
export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  CONFIRM_EMAIL: '/confirm-email',
  RESET_PASSWORD: '/reset-password',
  UNAUTHORIZED: '/unauthorized',
} as const;

// User routes (protected)
export const USER_ROUTES = {
  HOME: '/',
  FORUM: '/forum',
  NEWS: '/news',
  ROADMAP: '/roadmap',
  TEST_RIASEC: '/test-riasec',
  SETTINGS: '/settings',
} as const;

// Admin routes (protected)
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  USER_MANAGEMENT: '/admin/users',
  QUESTION_MANAGEMENT: '/admin/questions',
  BLOG_MANAGEMENT: '/admin/blogs',
  BLOG_UNPUBLISHED: '/admin/blogs/unpublished',
  NEWS_MANAGEMENT: '/admin/news',
  SUBSCRIPTION_PLANS: '/admin/subscription-plans',
  SETTINGS: '/admin/settings',
} as const;

// All routes combined
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...USER_ROUTES,
  ...ADMIN_ROUTES,
} as const;

// Route groups for easy access
export const ROUTE_GROUPS = {
  PUBLIC: Object.values(PUBLIC_ROUTES),
  USER: Object.values(USER_ROUTES),
  ADMIN: Object.values(ADMIN_ROUTES),
} as const;

// Navigation items for different user roles
export const NAVIGATION_ITEMS = {
  USER: [
    { label: 'Trang chủ', path: USER_ROUTES.HOME },
    { label: 'Diễn đàn', path: USER_ROUTES.FORUM },
    { label: 'Tin tức', path: USER_ROUTES.NEWS },
    { label: 'Test RIASEC', path: USER_ROUTES.TEST_RIASEC },
  ],
  ADMIN: [
    { label: 'Dashboard', path: ADMIN_ROUTES.DASHBOARD },
    { label: 'Quản lý người dùng', path: ADMIN_ROUTES.USER_MANAGEMENT },
    { label: 'Quản lý câu hỏi', path: ADMIN_ROUTES.QUESTION_MANAGEMENT },
    { label: 'Bài viết chưa đăng', path: ADMIN_ROUTES.BLOG_UNPUBLISHED },
    { label: 'Quản lý gói đăng ký', path: ADMIN_ROUTES.SUBSCRIPTION_PLANS },
    { label: 'Cài đặt', path: ADMIN_ROUTES.SETTINGS },
  ],
} as const;

// Helper function to get default route based on user role
export const getDefaultRouteByRole = (role: string | null): string => {
  switch (role) {
    case 'Admin':
      return ADMIN_ROUTES.DASHBOARD;
    case 'User':
    default:
      return USER_ROUTES.HOME;
  }
};

// Helper function to check if a route is accessible by role
export const isRouteAccessibleByRole = (
  route: string,
  role: string | null
): boolean => {
  if (!role) return false;

  const userRoutes = Object.values(USER_ROUTES) as string[];

  if (role === 'Admin') {
    // Admin can access both admin and user routes
    return route.startsWith('/admin') || userRoutes.includes(route);
  }

  if (role === 'User') {
    // User can only access user routes (not admin routes)
    return !route.startsWith('/admin') && userRoutes.includes(route);
  }

  return false;
};
