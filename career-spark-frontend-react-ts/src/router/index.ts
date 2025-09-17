// Main router component
export { default as AppRouter } from './AppRouter';

// Route protection components
export { default as ProtectedRoute } from './ProtectedRoute';

// Route constants
export * from './constants';

// Re-export commonly used router components from react-router-dom
export {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Link,
  NavLink,
  Navigate,
  Outlet,
} from 'react-router-dom';
