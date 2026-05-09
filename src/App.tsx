import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// Auth
import GetStartedPage from './pages/GetStartedPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Listings (public)
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';

// Buyer (protected + buyer-only)
import OrdersPage from './pages/OrdersPage';
import CartPage from './pages/CartPage';

// Vendor (protected + vendor-only)
import PostListingPage from './pages/PostListingPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import VerifyBusinessPage from './pages/VerifyBusinessPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ─────────────────────────────────────────── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />

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
    </BrowserRouter>
  );
}

export default App;
