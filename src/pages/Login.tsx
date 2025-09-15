import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { ROUTES } from '@/constants';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (user && !loading) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [user, loading, navigate]);

  // Don't render login form if user is already authenticated
  if (user && !loading) {
    return null;
  }

  return <LoginForm />;
}