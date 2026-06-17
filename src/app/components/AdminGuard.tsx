import { Navigate } from 'react-router';
import { ADMIN_SESSION_KEY } from '../pages/admin/AdminLogin';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const authenticated = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
  if (!authenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
