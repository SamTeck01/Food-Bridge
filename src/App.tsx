import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/layouts/PublicLayout';
import VendorLayout from './components/layouts/VendorLayout';

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
const PostListingPage = lazy(() => import('./pages/app/PostListingPage'));
const ListingsPage = lazy(() => import('./pages/app/ListingsPage'));
const OrdersPage = lazy(() => import('./pages/app/OrdersPage'));
const ImpactPage = lazy(() => import('./pages/app/ImpactPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Routes>
          {/* Public Website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/individuals" element={<IndividualsPage />} />
            <Route path="/vendors" element={<VendorPage />} />
            <Route path="/impact" element={<ImpactPage />} />
          </Route>

          {/* Auth (No Layout) */}
          <Route path="/login" element={<ProtectedRoute guestOnly><LoginPage /></ProtectedRoute>} />
          <Route path="/get-started" element={<ProtectedRoute guestOnly><GetStartedPage /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<ProtectedRoute requireVerification={false}><VerifyEmailPage /></ProtectedRoute>} />

          {/* App/Dashboard (Wrapped in VendorLayout) */}
          <Route element={<VendorLayout />}>
            <Route path="/vendor/dashboard" element={<ProtectedRoute requiredRole="vendor"><VendorDashboardPage /></ProtectedRoute>} />
            <Route path="/vendor/listings" element={<ProtectedRoute requiredRole="vendor"><ListingsPage /></ProtectedRoute>} />
            <Route path="/vendor/post-listing" element={<ProtectedRoute requiredRole="vendor"><PostListingPage /></ProtectedRoute>} />
            <Route path="/vendor/impact" element={<ProtectedRoute requiredRole="vendor"><ImpactPage /></ProtectedRoute>} />
            {/* <Route path="/vendor/profile" element={<ProtectedRoute requiredRole="vendor"><ProfilePage /></ProtectedRoute>} /> */}
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;