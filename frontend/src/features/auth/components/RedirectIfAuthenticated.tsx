import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

/**
 * Redirects authenticated users to their dashboard
 * Use this to wrap public pages like landing, login, and register
 */
export function RedirectIfAuthenticated({
  children,
}: RedirectIfAuthenticatedProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
