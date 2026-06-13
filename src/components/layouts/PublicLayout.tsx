import { Outlet, Navigate } from 'react-router-dom';
import Footer from '../Footer';
import Navbar from '../Navbar';
import { useApp } from '../../context/AppContext';

const PublicLayout = () => {
  const { isLoggedIn, user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoggedIn) {
    if (!user?.emailVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    if (user?.role === 'vendor') {
      return <Navigate to="/vendor/dashboard" replace />;
    }
    return <Navigate to="/listings" replace />;
  }

  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </>
  );
};
export default PublicLayout;