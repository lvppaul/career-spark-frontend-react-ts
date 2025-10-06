import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  from?: Location;
  reason?: 'invalid_role' | 'insufficient_permissions';
  requiredRole?: string;
  userRole?: string;
}

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const getErrorMessage = () => {
    switch (state?.reason) {
      case 'invalid_role':
        return 'Vai trò người dùng không hợp lệ.';
      case 'insufficient_permissions':
        return `Bạn cần quyền "${state.requiredRole}" để truy cập trang này. Vai trò hiện tại: "${state.userRole}".`;
      default:
        return 'Bạn không có quyền truy cập trang này.';
    }
  };

  const handleGoBack = () => {
    if (state?.from) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Truy cập bị từ chối
          </h2>
          <p className="text-gray-600 mb-6">{getErrorMessage()}</p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Quay lại
            </button>
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Về trang chủ
            </button>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && state && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-left">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Debug Info:
              </h4>
              <pre className="text-xs text-gray-600">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
