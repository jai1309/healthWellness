import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/useAuth";
import LoadingSpinner from './LoadingSpinner';

// ProtectedRoute guards pages that require a valid JWT-backed session.
// Today that session is mocked in localStorage; later the backend-issued JWT
// will be checked by Express middleware while the frontend checks local auth state.
function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const { currentUser, role, isAuthLoading, isAuthenticated } = useAuth();

  if (isAuthLoading) {
    return <LoadingSpinner label="Checking your secure session..." />;
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === 'provider' ? '/provider/dashboard' : '/patient/dashboard'}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
