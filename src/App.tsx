import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/Contact'));
const IndividulasPage = lazy(() => import('./pages/Individuals'));
const VendorPage = lazy(() => import('./pages/VendorPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ImpactPage = lazy(() => import('./pages/ImpactPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Auth
const GetStartedPage = lazy(() => import('./pages/GetStartedPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));

// Listings (public)
const ListingsPage = lazy(() => import('./pages/ListingsPage'));
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage'));

// Buyer (protected + buyer-only)
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const CartPage = lazy(() => import('./pages/CartPage'));

// Vendor (protected + vendor-only)
const PostListingPage = lazy(() => import('./pages/PostListingPage'));
const VendorDashboardPage = lazy(() => import('./pages/VendorDashboardPage'));
const VerifyBusinessPage = lazy(() => import('./pages/VerifyBusinessPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg">
    <div className="w-8 h-8 border-4 border-border border-t-brand-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public ─────────────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/individuals" element={<IndividulasPage />} />

          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/vendors" element={<VendorPage />} />
          {/* ── Auth (guest-only: redirect home if logged in) ──── */}
          <Route
            path="/get-started"
            element={
              <ProtectedRoute guestOnly>
                <GetStartedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute guestOnly>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ── Buyer-only ───────────────────────────────────────── */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="buyer">
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute requiredRole="buyer">
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* ── Vendor-only ──────────────────────────────────────── */}
          <Route
            path="/post-listing"
            element={
              <ProtectedRoute requiredRole="vendor">
                <PostListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-business"
            element={
              <ProtectedRoute requiredRole="vendor">
                <VerifyBusinessPage />
              </ProtectedRoute>
            }
          />

          {/* ── 404 ────────────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
