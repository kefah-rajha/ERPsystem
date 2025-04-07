import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!loading && isAuthenticated && allowedRoles && allowedRoles.length > 0) {
      if (!hasRole(allowedRoles)) {
        router.push('/unauthorized'); 
      }
    }
  }, [isAuthenticated, loading, router, allowedRoles, hasRole, user]);

  if (loading) {
    return <div>Checking authentication...</div>; 
  }

  const isAuthorized = !allowedRoles || allowedRoles.length === 0 || hasRole(allowedRoles);
  return isAuthenticated && isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;