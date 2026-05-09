import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useApp } from '../context/AppContext';
import {
  Search, ShoppingBasket, MapPin, ChevronDown,
  LayoutDashboard, Package, PlusSquare, LogOut, User,
  Menu, X
} from 'lucide-react';

const Navbar = () => {
  const { isLoggedIn, user, logout, cartCount } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isVendor = user?.role === 'vendor';
  const isBuyer  = user?.role === 'buyer';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/listings?q=${encodeURIComponent(searchQuery.trim())}` : '/listings');
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="w-full border-b border-border bg-white/95 backdrop-blur-sm sticky top-0 z-50 transition-shadow"
        style={{ boxShadow: '0 1px 3px rgba(10,38,35,0.06)' }}>
        <div className="max-w-[1280px] mx-auto px-6 py-3">
          <div className="flex items-center gap-5">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 transition-opacity hover:opacity-80">
              <Logo />
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-border flex-shrink-0" />

            {/* Location — desktop */}
            <button className="hidden md:flex items-center gap-1.5 flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors">
              <MapPin size={15} strokeWidth={1.8} className="text-brand-primary" />
              <span className="font-questrial text-sm whitespace-nowrap">Ilorin, Kwara</span>
            </button>

            {/* Search — desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-center gap-2 h-10 px-4 rounded-full bg-bg border border-border hover:border-[#B8D0B8] focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-[#7AD37125] transition-all">
              <Search size={15} className="text-text-muted flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food listings…"
                className="flex-1 bg-transparent font-questrial text-sm text-text-primary placeholder:text-text-muted outline-none"
              />
            </form>

            {/* Spacer on mobile */}
            <div className="flex-1 md:hidden" />

            {/* Right actions */}
            <div className="flex items-center gap-2.5">
              {/* Cart — buyers & guests */}
              {(!isLoggedIn || isBuyer) && (
                <button
                  onClick={() => navigate(isLoggedIn ? '/cart' : '/login')}
                  className="relative flex items-center justify-center h-10 w-10 rounded-full border border-border bg-white hover:border-brand-primary hover:bg-bg transition-all"
                  aria-label="Cart"
                >
                  <ShoppingBasket size={18} className="text-text-primary" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full bg-[#EF4444] text-white text-[10px] font-questrial font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* User / Auth */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    aria-expanded={dropdownOpen}
                    className="flex items-center gap-2 h-10 px-3 rounded-full bg-[#0F3934] text-white hover:bg-[#1A4A3F] transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                      <User size={13} className="text-[#0F3934]" />
                    </div>
                    <span className="font-questrial text-sm hidden sm:inline">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-border shadow-panel z-50 py-2 overflow-hidden animate-scale-in">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-9 h-9 rounded-full bg-brand-primary/20 flex items-center justify-center">
                            <User size={16} className="text-brand-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-questrial text-sm text-text-primary truncate">{user?.name}</p>
                            <p className="font-questrial text-xs text-text-muted truncate">{user?.email}</p>
                          </div>
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-questrial capitalize ${
                          isVendor ? 'bg-brand-primary/15 text-brand-secondary' : 'bg-[#F0F4F1] text-text-secondary'
                        }`}>
                          {user?.role}
                        </span>
                      </div>

                      {/* Vendor links */}
                      {isVendor && (
                        <>
                          <Link to="/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 font-questrial text-sm text-text-primary hover:bg-bg transition-colors">
                            <LayoutDashboard size={15} className="text-brand-secondary" /> Dashboard
                          </Link>
                          <Link to="/post-listing"
                            className="flex items-center gap-3 px-4 py-2.5 font-questrial text-sm text-text-primary hover:bg-bg transition-colors">
                            <PlusSquare size={15} className="text-brand-secondary" /> Post a Listing
                          </Link>
                        </>
                      )}

                      {/* Buyer links */}
                      {isBuyer && (
                        <Link to="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 font-questrial text-sm text-text-primary hover:bg-bg transition-colors">
                          <Package size={15} className="text-brand-secondary" /> Your Orders
                        </Link>
                      )}

                      <div className="h-px bg-border my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 font-questrial text-sm text-[#EF4444] hover:bg-[#EF444408] transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="hidden sm:flex items-center h-10 px-5 rounded-full border border-border font-questrial text-sm text-text-primary hover:border-brand-primary hover:bg-bg transition-all">
                    Log In
                  </Link>
                  <Link to="/get-started" className="flex items-center h-10 px-5 rounded-full bg-[#0F3934] text-white font-questrial text-sm hover:bg-[#1A4A3F] hover:shadow-md transition-all">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-border hover:bg-bg transition-all"
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          {mobileOpen && (
            <div className="md:hidden pt-3 pb-2 border-t border-border mt-3 animate-slide-up">
              <form onSubmit={handleSearch} className="flex items-center gap-2 h-10 px-4 rounded-full bg-bg border border-border focus-within:border-brand-primary transition-all">
                <Search size={15} className="text-text-muted flex-shrink-0" />
                <input
                  type="text"
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
