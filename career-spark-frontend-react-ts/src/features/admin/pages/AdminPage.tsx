import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import { ADMIN_ROUTES } from '@/router/constants';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const onNavigate = (target: string) => {
    switch (target) {
      case 'user-management':
        navigate(ADMIN_ROUTES.USER_MANAGEMENT);
        break;
      case 'question-management':
        navigate(ADMIN_ROUTES.QUESTION_MANAGEMENT);
        break;
      default:
        break;
    }
  };

  return <AdminDashboard onNavigate={onNavigate} />;
};

export default AdminPage;
