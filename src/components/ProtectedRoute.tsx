import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  /** If true, authenticated users are redirected away (for login/register pages) */
  guestOnly?: boolean;
  /** If set, only users with this role may access the route. Others are redirected to /. */
  requiredRole?: 'buyer' | 'vendor';
}

const ProtectedRoute = ({ children, guestOnly = false, requiredRole }: ProtectedRouteProps) => {
  const { isLoggedIn, user, authLoading } = useApp();
  const location = useLocation();

  // Wait for session check before making any redirect decision
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-questrial text-sm text-text-muted">Loading…</p>
        </div>
      </div>
    );
  }

  // Guest-only: redirect logged-in users to their dashboard/listings
  if (guestOnly && isLoggedIn) {
    if (user?.role === 'vendor') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/listings" replace />;
  }

  // Require auth
  if (!guestOnly && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Require specific role
  if (requiredRole && user?.role !== requiredRole) {
    // Buyers trying to access vendor pages → home
    // Vendors trying to access buyer pages → home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
