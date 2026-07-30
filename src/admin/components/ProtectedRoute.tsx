import type { ReactNode, FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useData } from '../../shared/context/DataContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isAdmin, isLoading } = useData();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-primary text-primary">Checking session...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/tlku/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
