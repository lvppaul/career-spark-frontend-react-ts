import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PurchasePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to subscription page — PurchasePage is deprecated
    navigate('/subscription', { replace: true });
  }, [navigate]);

  return null;
}
