import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  // const { isAuthenticated, loading } = useAuth();
  // const location = useLocation();

  // if (loading) return null; // or a spinner
  // if (!isAuthenticated) {
  //   return <Navigate to="/auth" state={{ from: location }} replace />;
  // }
  return children;
}
