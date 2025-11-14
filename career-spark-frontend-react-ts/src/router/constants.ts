// Public routes (accessible without login)
export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  CONFIRM_EMAIL: '/confirm-email',
  RESET_PASSWORD: '/reset-password',
  UNAUTHORIZED: '/unauthorized',
  HOME: '/',
  FORUM: '/forum',
  NEWS: '/news',
  TEST_RIASEC: '/test-riasec',
} as const;

// User routes (protected - require authentication)
export const USER_ROUTES = {
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  ROADMAP: '/roadmap',
  TEST_RIASEC_RESULT: '/test-riasec/result',
  TEST_RIASEC_HISTORY: '/test-riasec/history',
  MATCHING_JOBS: '/matching-jobs',
  SUBSCRIPTION: '/subscription',
  PAYMENT_RESULT: '/payment/result',
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
  ORDERS: '/admin/orders',
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
    { label: 'Trang chủ', path: PUBLIC_ROUTES.HOME },
    { label: 'Diễn đàn', path: PUBLIC_ROUTES.FORUM },
    { label: 'Tin tức', path: PUBLIC_ROUTES.NEWS },
    { label: 'Test RIASEC', path: PUBLIC_ROUTES.TEST_RIASEC },
  ],
  ADMIN: [
    { label: 'Dashboard', path: ADMIN_ROUTES.DASHBOARD },
    { label: 'Quản lý người dùng', path: ADMIN_ROUTES.USER_MANAGEMENT },
    { label: 'Quản lý câu hỏi', path: ADMIN_ROUTES.QUESTION_MANAGEMENT },
    { label: 'Bài viết chưa đăng', path: ADMIN_ROUTES.BLOG_UNPUBLISHED },
    { label: 'Quản lý gói đăng ký', path: ADMIN_ROUTES.SUBSCRIPTION_PLANS },
    { label: 'Quản lý đơn hàng', path: ADMIN_ROUTES.ORDERS },
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
      return PUBLIC_ROUTES.HOME;
  }
};

// Helper function to check if a route is accessible by role
export const isRouteAccessibleByRole = (
  route: string,
  role: string | null
): boolean => {
  const publicRoutes = Object.values(PUBLIC_ROUTES) as string[];
  const userRoutes = Object.values(USER_ROUTES) as string[];

  // Public routes are accessible by everyone
  if (publicRoutes.some((publicRoute) => route.startsWith(publicRoute))) {
    return true;
  }

  if (!role) return false;

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
