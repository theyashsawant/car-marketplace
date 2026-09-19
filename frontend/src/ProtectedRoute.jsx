import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="empty">Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  if (role && user.role !== role && user.role !== 'dealer') {
    return (
      <p className="empty">
        You need a car owner account to access this page.
      </p>
    );
  }

  return children;
}

export default ProtectedRoute;