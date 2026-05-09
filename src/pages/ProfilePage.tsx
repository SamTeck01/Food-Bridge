import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { useApp } from '../context/AppContext';
import {
  User, Mail, Phone, MapPin, ShieldCheck, LogOut,
  ChevronRight, Package, LayoutDashboard, PlusSquare,
  Bell, Heart, Settings, HelpCircle, Star,
} from 'lucide-react';

const ProfilePage = () => {
  const { isLoggedIn, user, logout } = useApp();
  const navigate = useNavigate();
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const isVendor = user?.role === 'vendor';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-bg pb-24 md:pb-0">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 py-20 px-6 text-center">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#EFF4F0] border border-border">
            <User size={40} className="text-[#0F3934]" />
          </div>
          <div>
            <h1 className="font-questrial text-2xl text-text-primary mb-2">Sign in to view your profile</h1>
            <p className="font-questrial text-base text-text-secondary max-w-sm">
              Create an account or log in to track your orders, manage listings, and see your impact.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/get-started" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Log In</Link>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

  const vendorMenu = [
    { icon: LayoutDashboard, label: 'Vendor Dashboard', path: '/dashboard' },
    { icon: PlusSquare,      label: 'Post a Listing',  path: '/post-listing' },
    { icon: Package,         label: 'Your Listings',   path: '/dashboard' },
    { icon: ShieldCheck,     label: 'Verify Business', path: '/verify-business', badge: 'New' },
  ];

  const buyerMenu = [
    { icon: Package, label: 'My Orders', path: '/orders' },
    { icon: Heart,   label: 'Saved',     path: '/listings' },
  ];

  const generalMenu = [
    { icon: Bell,       label: 'Notifications',     path: '/profile' },
    { icon: Settings,   label: 'Account Settings',  path: '/profile' },
    { icon: HelpCircle, label: 'Help & Support',    path: '/profile' },
    { icon: Star,       label: 'Rate the App',      path: '/profile' },
  ];

  const primaryMenu = isVendor ? vendorMenu : buyerMenu;

  return (
    <div className="min-h-screen flex flex-col bg-bg pb-24 md:pb-0">
      <Navbar />

      <main className="flex-1 py-10 px-4 md:px-6">
        <div className="max-w-[640px] mx-auto flex flex-col gap-6">

          {/* ── Profile card ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.10)] p-6"
            style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-[#7AD371]/25 flex items-center justify-center flex-shrink-0 border-2 border-[#7AD371]/40">
                <span className="font-questrial text-2xl text-[#0F3934]">{initial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-questrial text-xl text-text-primary truncate">{user?.name}</h1>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-questrial capitalize mt-1 ${
                  isVendor ? 'bg-[#7AD371]/15 text-[#0F3934]' : 'bg-[#F0F4F1] text-text-secondary'
                }`}>
                  {user?.role}
                </span>
              </div>
              <button className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:border-[#7AD371] transition-all">
                <Settings size={15} className="text-text-muted" />
              </button>
            </div>

            {/* Info rows */}
            <div className="flex flex-col gap-3 mt-5 pt-5 border-t border-border">
              {user?.email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F0F4F1]">
                    <Mail size={14} className="text-text-secondary" />
                  </div>
                  <span className="font-questrial text-sm text-text-primary truncate">{user.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F0F4F1]">
                  <Phone size={14} className="text-text-secondary" />
                </div>
                <span className="font-questrial text-sm text-text-muted">Not set</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F0F4F1]">
                  <MapPin size={14} className="text-text-secondary" />
                </div>
                <span className="font-questrial text-sm text-text-primary">Ilorin, Kwara</span>
              </div>
            </div>
          </div>

          {/* ── Quick stats ──────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '0', label: isVendor ? 'Listings' : 'Orders' },
              { value: '0', label: isVendor ? 'Claims'   : 'Saved'  },
              { value: '4.9★', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.10)] p-4 text-center"
                style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
                <p className="font-questrial text-xl text-text-primary">{stat.value}</p>
                <p className="font-questrial text-xs text-text-muted mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── Primary menu ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.10)] overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
            <p className="font-questrial text-xs text-text-muted uppercase tracking-wide px-5 pt-4 pb-2">
              {isVendor ? 'Vendor Tools' : 'My Activity'}
            </p>
            {primaryMenu.map(({ icon: Icon, label, path, badge }: any) => (
              <Link
                key={label}
                to={path}
                className="flex items-center gap-4 px-5 py-3.5 border-t border-border hover:bg-bg transition-colors"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F0F4F1]">
                  <Icon size={16} className="text-[#0F3934]" />
                </div>
                <span className="flex-1 font-questrial text-sm text-text-primary">{label}</span>
                {badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-questrial bg-[#7AD371]/20 text-[#0F3934]">
                    {badge}
                  </span>
                )}
                <ChevronRight size={15} className="text-text-muted" />
              </Link>
            ))}
          </div>

          {/* ── General menu ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.10)] overflow-hidden"
            style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
            <p className="font-questrial text-xs text-text-muted uppercase tracking-wide px-5 pt-4 pb-2">
              Settings
            </p>
            {generalMenu.map(({ icon: Icon, label, path }) => (
              <Link
                key={label}
                to={path}
                className="flex items-center gap-4 px-5 py-3.5 border-t border-border hover:bg-bg transition-colors"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F0F4F1]">
                  <Icon size={16} className="text-text-secondary" />
                </div>
                <span className="flex-1 font-questrial text-sm text-text-primary">{label}</span>
                <ChevronRight size={15} className="text-text-muted" />
              </Link>
            ))}
          </div>

          {/* ── Sign out ─────────────────────────────────────── */}
          {!logoutConfirm ? (
            <button
              onClick={() => setLogoutConfirm(true)}
              className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-[rgba(0,0,0,0.10)] text-left hover:bg-bg transition-colors w-full"
              style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#EF444415]">
                <LogOut size={16} className="text-[#EF4444]" />
              </div>
              <span className="flex-1 font-questrial text-sm text-[#EF4444]">Sign Out</span>
            </button>
          ) : (
            <div className="bg-white rounded-2xl border border-[rgba(239,68,68,0.20)] p-5"
              style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
              <p className="font-questrial text-sm text-text-primary mb-4">Are you sure you want to sign out?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 h-10 rounded-full bg-[#EF4444] text-white font-questrial text-sm hover:bg-[#DC2626] transition-colors"
                >
                  Yes, sign out
                </button>
                <button
                  onClick={() => setLogoutConfirm(false)}
                  className="flex-1 h-10 rounded-full border border-border font-questrial text-sm text-text-primary hover:bg-bg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Version ──────────────────────────────────────── */}
          <p className="text-center font-questrial text-xs text-text-muted">
            FoodBridge v1.0.0 — Reducing food waste, one meal at a time 🌿
          </p>

        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ProfilePage;
