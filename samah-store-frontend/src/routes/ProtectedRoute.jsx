import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const normalizeRole = (role) => {
  if (!role) return '';
  return role.toUpperCase().replace('ROLE_', '');
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles required, check user role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = normalizeRole(user?.role);
    const normalizedAllowedRoles = allowedRoles.map(role => normalizeRole(role));

    if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
      return <Navigate to="/403" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

