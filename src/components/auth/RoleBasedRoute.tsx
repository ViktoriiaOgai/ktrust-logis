import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  allowUnauthenticated?: boolean; // Добавляем параметр для неавторизованных пользователей
}

export default function RoleBasedRoute({ children, allowedRoles, allowUnauthenticated = false }: RoleBasedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Если разрешён доступ без авторизации (для обычных пользователей)
  if (allowUnauthenticated && !isAuthenticated) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}
