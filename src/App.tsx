import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/layouts/PublicLayout';
import VendorLayout from './components/layouts/VendorLayout';
import BuyerLayout from './components/layouts/BuyerLayout';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Marketing Pages
const HomePage = lazy(() => import('./pages/marketing/HomePage'));
const AboutPage = lazy(() => import('./pages/marketing/AboutPage'));
const ContactPage = lazy(() => import('./pages/marketing/Contact'));
const IndividualsPage = lazy(() => import('./pages/marketing/Individuals'));
const VendorPage = lazy(() => import('./pages/marketing/VendorPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const GetStartedPage = lazy(() => import('./pages/auth/GetStartedPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));

// App/Dashboard Pages
const VendorDashboardPage = lazy(() => import('./pages/app/vendor/VendorDashboardPage'));
const VendorListingsPage = lazy(() => import('./pages/app/vendor/VendorListingsPage'));
const VendorListingDetailPage = lazy(() => import('./pages/app/vendor/VendorListingDetailPage'));
const PostListingPage = lazy(() => import('./pages/app/PostListingPage'));
const ListingsPage = lazy(() => import('./pages/app/ListingsPage'));
const OrdersPage = lazy(() => import('./pages/app/OrdersPage'));
const ImpactPage = lazy(() => import('./pages/app/ImpactPage'));
const CartPage = lazy(() => import('./pages/app/CartPage'));
const ListingDetailPage = lazy(() => import('./pages/app/ListingDetailPage'));
const ProfilePage = lazy(() => import('./pages/app/ProfilePage'));
const VerifyBusinessPage = lazy(() => import('./pages/auth/VerifyBusinessPage'));
const ClaimSuccessPage = lazy(() => import('./pages/app/ClaimSuccessPage'));
const SavedPage = lazy(() => import('./pages/app/SavedPage'));

const ImpactRouteWrapper = () => {
  const { isLoggedIn, user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF2]">
        <div className="w-10 h-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoggedIn) {
    if (!user?.emailVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    if (user?.role === 'vendor') {
      return <Navigate to="/vendor/impact" replace />;
    }
    // Buyer: redirect to orders (Impact is vendor-only)
    return <Navigate to="/orders" replace />;
  }

  // Guest view: wrap in PublicLayout style
  return (
    <>
      <Navbar />
      <main>
        <ImpactPage />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDF2]">
          <div className="w-10 h-10 border-4 border-[#7AD371] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          {/* Public Website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/individuals" element={<IndividualsPage />} />
            <Route path="/vendors" element={<VendorPage />} />
          </Route>

          {/* Combined guest/buyer route for /impact */}
          <Route path="/impact" element={<ImpactRouteWrapper />} />

          {/* Auth (No Layout) */}
          <Route path="/login" element={<ProtectedRoute guestOnly><LoginPage /></ProtectedRoute>} />
          <Route path="/get-started" element={<ProtectedRoute guestOnly><GetStartedPage /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<ProtectedRoute requireVerification={false}><VerifyEmailPage /></ProtectedRoute>} />

          {/* App/Dashboard (Wrapped in BuyerLayout) */}
          <Route element={<BuyerLayout />}>
            <Route path="/listings" element={<ProtectedRoute requiredRole="buyer"><ListingsPage /></ProtectedRoute>} />
            <Route path="/listings/:id" element={<ProtectedRoute requiredRole="buyer"><ListingDetailPage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute requiredRole="buyer"><CartPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute requiredRole="buyer"><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id/claim-success" element={<ProtectedRoute requiredRole="buyer"><ClaimSuccessPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute requiredRole="buyer"><ProfilePage /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute requiredRole="buyer"><SavedPage /></ProtectedRoute>} />
          </Route>

          {/* App/Dashboard (Wrapped in VendorLayout) */}
          <Route element={<VendorLayout />}>
            <Route path="/vendor/dashboard" element={<ProtectedRoute requiredRole="vendor"><VendorDashboardPage /></ProtectedRoute>} />
            <Route path="/vendor/listings" element={<ProtectedRoute requiredRole="vendor"><VendorListingsPage /></ProtectedRoute>} />
            <Route path="/vendor/listings/:id" element={<ProtectedRoute requiredRole="vendor"><VendorListingDetailPage /></ProtectedRoute>} />
            <Route path="/vendor/post-listing" element={<ProtectedRoute requiredRole="vendor"><PostListingPage /></ProtectedRoute>} />
            <Route path="/vendor/impact" element={<ProtectedRoute requiredRole="vendor"><ImpactPage /></ProtectedRoute>} />
            <Route path="/vendor/profile" element={<ProtectedRoute requiredRole="vendor"><ProfilePage /></ProtectedRoute>} />
            <Route path="/vendor/verify-business" element={<ProtectedRoute requiredRole="vendor"><VerifyBusinessPage /></ProtectedRoute>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;