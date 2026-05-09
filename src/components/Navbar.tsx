import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useApp } from '../context/AppContext';
import {
  Search, ShoppingBasket, MapPin, ChevronDown,
  LayoutDashboard, Package, PlusSquare, LogOut, User,
  Bell, Plus, Home, Flame, Leaf,
} from 'lucide-react';

/* ── Desktop nav item ──────────────────────────────────────────────── */
const NavItem = ({ to, label, icon: Icon, active }: {
  to: string; label: string; icon: React.ElementType; active: boolean;
}) => (
  <Link
    to={to}
    className={`flex items-center gap-2 h-10 px-4 rounded-[10px] font-questrial text-[15px] transition-all ${
      active
        ? 'bg-[#0A2623] text-white'
        : 'text-[rgba(10,38,35,0.60)] hover:bg-[#F0F4F1] hover:text-[#0A2623]'
    }`}
  >
    <Icon size={16} strokeWidth={1.8} />
    <span>{label}</span>
  </Link>
);

const Navbar = () => {
  const { isLoggedIn, user, logout, cartCount } = useApp();
  const [searchQuery, setSearchQuery]   = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate    = useNavigate();
  const { pathname } = useLocation();

  const isVendor = user?.role === 'vendor';
  const isBuyer  = user?.role === 'buyer';

  /* close dropdown on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* close on route change */
  useEffect(() => { setDropdownOpen(false); setMobileSearch(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/listings?q=${encodeURIComponent(searchQuery.trim())}` : '/listings');
  };

  const handleLogout = () => { logout(); setDropdownOpen(false); navigate('/'); };

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <>
      <header
        className="w-full border-b border-border bg-white/95 backdrop-blur-sm sticky top-0 z-50"
        style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 h-[64px]">

            {/* ── Logo ─────────────────────────────────────────── */}
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <Logo />
            </Link>

            {/* ── Divider ──────────────────────────────────────── */}
            <div className="hidden lg:block w-px h-7 bg-border flex-shrink-0" />

            {/* ── Location ─────────────────────────────────────── */}
            <button className="hidden lg:flex items-center gap-1.5 flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors">
              <MapPin size={14} strokeWidth={2} className="text-brand-primary" />
              <span className="font-questrial text-[14px] whitespace-nowrap">Ilorin, Kwara</span>
            </button>

            {/* ── Desktop nav links (Figma sidebar-as-topbar) ──── */}
            <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
              <NavItem to="/"         label="Home"     icon={Home}  active={isActive('/')} />
              <NavItem to="/listings" label="Listings" icon={Flame} active={isActive('/listings')} />
              <NavItem to="/impact"   label="Impact"   icon={Leaf}  active={isActive('/impact')} />
              <NavItem to="/profile"  label="Profile"  icon={User}  active={isActive('/profile')} />
            </nav>

            {/* ── Search ───────────────────────────────────────── */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex flex-1 items-center gap-2 h-10 px-4 rounded-full bg-bg border border-border hover:border-[#B8D0B8] focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-[#7AD37125] transition-all"
            >
              <Search size={14} className="text-text-muted flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food listings…"
                className="flex-1 bg-transparent font-questrial text-sm text-text-primary placeholder:text-text-muted outline-none"
              />
            </form>

            {/* ── Spacer on small screens ───────────────────────── */}
            <div className="flex-1 md:hidden" />

            {/* ── Right actions ─────────────────────────────────── */}
            <div className="flex items-center gap-2">

              {/* Mobile search toggle */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-border hover:bg-bg transition-all"
                onClick={() => setMobileSearch((v) => !v)}
                aria-label="Search"
              >
                <Search size={17} className="text-text-primary" />
              </button>

              {/* Cart — buyers & guests */}
              {(!isLoggedIn || isBuyer) && (
                <button
                  onClick={() => navigate(isLoggedIn ? '/cart' : '/login')}
                  className="relative flex items-center justify-center h-10 w-10 rounded-full border border-border bg-white hover:border-brand-primary transition-all"
                  aria-label="Cart"
                >
                  <ShoppingBasket size={17} className="text-text-primary" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#EF4444] text-white text-[10px] font-questrial px-1">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Notification bell */}
              {isLoggedIn && (
                <button
                  className="relative flex items-center justify-center h-10 w-10 rounded-full border border-border bg-white hover:border-brand-primary transition-all"
                  aria-label="Notifications"
                >
                  <Bell size={17} className="text-text-primary" />
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#EF4444] text-white text-[9px] font-questrial">
                    2
                  </span>
                </button>
              )}

              {/* Post button — Figma: rounded pill with + icon */}
              {isLoggedIn && isVendor && (
                <Link
                  to="/post-listing"
                  className="hidden sm:flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#0A2623] text-white font-questrial text-[14px] hover:bg-[#0F3934] transition-all"
                >
                  Post
                  <Plus size={14} strokeWidth={2.5} />
                </Link>
              )}

              {/* User / Auth */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    aria-expanded={dropdownOpen}
                    className="flex items-center gap-2 h-10 pl-2 pr-3 rounded-full bg-[#0F3934] text-white hover:bg-[#1A4A3F] transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                      <span className="font-questrial text-xs text-[#0F3934] font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="font-questrial text-sm hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={13} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-border z-50 py-2 overflow-hidden animate-scale-in"
                      style={{ boxShadow: '0 8px 30px rgba(10,38,35,0.12)' }}>
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-questrial text-sm text-text-primary truncate">{user?.name}</p>
                        <p className="font-questrial text-xs text-text-muted truncate">{user?.email}</p>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-questrial capitalize ${
                          isVendor ? 'bg-brand-primary/15 text-brand-secondary' : 'bg-[#F0F4F1] text-text-secondary'
                        }`}>
                          {user?.role}
                        </span>
                      </div>

                      {isVendor && (
                        <>
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 font-questrial text-sm text-text-primary hover:bg-bg transition-colors">
                            <LayoutDashboard size={15} className="text-brand-secondary" /> Dashboard
                          </Link>
                          <Link to="/post-listing" className="flex items-center gap-3 px-4 py-2.5 font-questrial text-sm text-text-primary hover:bg-bg transition-colors">
                            <PlusSquare size={15} className="text-brand-secondary" /> Post a Listing
                          </Link>
                        </>
                      )}

                      {isBuyer && (
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 font-questrial text-sm text-text-primary hover:bg-bg transition-colors">
                          <Package size={15} className="text-brand-secondary" /> Your Orders
                        </Link>
                      )}

                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 font-questrial text-sm text-text-primary hover:bg-bg transition-colors">
                        <User size={15} className="text-brand-secondary" /> Profile
                      </Link>

                      <div className="h-px bg-border my-1" />

                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 font-questrial text-sm text-[#EF4444] hover:bg-[#EF444408] transition-colors">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login"
                    className="hidden sm:flex items-center h-10 px-4 rounded-full border border-border font-questrial text-sm text-text-primary hover:border-brand-primary hover:bg-bg transition-all">
                    Log In
                  </Link>
                  <Link to="/get-started"
                    className="flex items-center h-10 px-4 rounded-full bg-[#0F3934] text-white font-questrial text-sm hover:bg-[#1A4A3F] transition-all">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          {mobileSearch && (
            <div className="lg:hidden pb-3 animate-slide-up">
              <form onSubmit={handleSearch} className="flex items-center gap-2 h-10 px-4 rounded-full bg-bg border border-border focus-within:border-brand-primary transition-all">
                <Search size={14} className="text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search food listings…"
                  className="flex-1 bg-transparent font-questrial text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
              </form>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
