import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBasket, LogOut, Menu, X, MapPin, Search, ChevronDown, Heart, Headset, ArrowUpRight, User, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuyerNavbar() {
  const { user, logout, cartCount } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const searchQuery = searchParams.get('q') ?? '';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (pathname !== '/listings') {
      navigate(`/listings?q=${encodeURIComponent(value)}`);
    } else {
      setSearchParams((prev) => {
        if (value) prev.set('q', value);
        else prev.delete('q');
        return prev;
      }, { replace: true });
    }
  };

  const toggleDrawer = () => {
    setSearchParams((prev) => {
      if (prev.get('drawer') === 'orders') {
        prev.delete('drawer');
      } else {
        prev.set('drawer', 'orders');
      }
      return prev;
    }, { replace: true });
  };

  return (
    <>
      <nav className="z-50 md:px-[6.25rem] px-4 pt-[2rem] bg-[#FFFDF2] select-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-[77.5rem] mx-auto bg-[#FFFFFF] border border-[#0000001A] h-[65px] rounded-full pl-[32px] pr-[12px] flex items-center justify-between shadow-sm relative"
        >
          {/* Logo, Separator & Location Pill */}
          <div className="flex items-center gap-[24px]">
            <Link to="/listings" className="flex items-center gap-2">
              <img src="/images/homepage/logo.svg" alt="FoodBridge Logo" className="h-8 w-auto" />
            </Link>
            <div className="hidden sm:block w-[1px] h-[30px] bg-black/10"></div>
            <div className="hidden sm:flex items-center gap-[8px] text-brand-secondary font-questrial whitespace-nowrap text-[16px]">
              <MapPin size={16} className="text-brand-secondary flex-shrink-0" />
              <span>Ilorin, Kwara</span>
            </div>

          </div>

          {/* Search Bar (Tied directly to URL filters) */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-[280px] h-[40px] px-6 rounded-full bg-[#F9F9F9] mx-4">
            <Search size={16} className="text-[#0A2623]/70 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search food..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-transparent outline-none font-questrial text-[16px] text-text-primary placeholder:text-[#0A2623]/30"
            />
          </div>

          {/* Actions: Cart/Claims Drawer + User Profile Dropdown */}
          <div className="flex items-center gap-[16px]">
            {/* Claims Drawer button (Figma Basket) */}
            <button 
              onClick={toggleDrawer}
              className="relative h-[40px] px-3 border border-black/10 bg-white hover:border-[#7AD371] transition-all flex items-center justify-center gap-3 rounded-full cursor-pointer group"
            >
              <ShoppingBasket size={20} className="text-[#0A2623] group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="bg-state-error text-white font-questrial text-[12px] w-[18px] h-[18px] rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown dark pill — desktop only */}
            <div className="relative hidden lg:flex">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-[40px] pl-1.5 pr-3 items-center gap-[10px] rounded-full bg-[#0A2623] text-white hover:bg-[#061816] transition-all cursor-pointer shadow-sm"
              >
                <div className="w-[30px] h-[30px] rounded-full bg-[#7AD371] flex items-center justify-center text-[#0F3934] font-semibold text-sm font-questrial">
                  {userInitial}
                </div>
                <span className="hidden sm:inline font-questrial text-[16px] font-normal leading-[130%]">Hi {firstName} 👋</span>
                <ChevronDown size={16} className="text-white flex-shrink-0" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-[250px] bg-[#F9F9F9] border border-black/10 shadow-lg rounded-[10px] z-20 py-[5px] flex flex-col items-stretch overflow-hidden"
                      style={{ boxShadow: '0 4px 20px rgba(10,38,35,0.08)' }}
                    >
                      {/* Frame 1618869795: Profile details block */}
                      <div className="flex flex-col gap-[12px] p-[16px_24px] self-stretch items-start">
                        {/* Ellipse 13 */}
                        <div className="w-[40px] h-[40px] rounded-full bg-[#D9D9D9] flex items-center justify-center text-[#0A2623] font-questrial font-semibold text-lg">
                          {userInitial}
                        </div>
                        {/* Frame 1618869794 */}
                        <div className="flex flex-col items-start gap-1 self-stretch min-w-0">
                          <span className="text-[#0A2623] font-questrial text-[16px] font-normal leading-[130%] truncate w-full" title={user?.name || 'Baskey Koer'}>
                            {user?.name || 'Baskey Koer'}
                          </span>
                          <span className="text-[#0A2623]/70 font-questrial text-[12px] font-normal leading-[130%] truncate w-full" title={user?.email || '+234 913 892 7486'}>
                            {user?.email || '+234 913 892 7486'}
                          </span>
                        </div>
                      </div>

                      {/* Line 25 */}
                      <div className="h-[1px] bg-black/10 self-stretch"></div>

                      {/* Favorites row (Frame 1618869543) */}
                      <Link 
                        to="/saved" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex h-[53px] items-center gap-[12px] p-[16px_24px] bg-[#F9F9F9] hover:bg-black/5 transition-all text-[#0A2623] group select-none cursor-pointer"
                      >
                        <Heart size={16} className="text-[#0A2623]" />
                        <span className="flex-1 font-questrial text-[16px] font-normal leading-[130%]">Favorites</span>
                        <ArrowUpRight size={16} className="text-[#0A2623] opacity-55 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      {/* Divider */}
                      <div className="h-[1px] bg-black/10 self-stretch"></div>

                      {/* My Profile row */}
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex h-[53px] items-center gap-[12px] p-[16px_24px] bg-[#F9F9F9] hover:bg-black/5 transition-all text-[#0A2623] group select-none cursor-pointer"
                      >
                        <User size={16} className="text-[#0A2623]" />
                        <span className="flex-1 font-questrial text-[16px] font-normal leading-[130%]">My Profile</span>
                        <ArrowUpRight size={16} className="text-[#0A2623] opacity-55 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      {/* My Orders row */}
                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex h-[53px] items-center gap-[12px] p-[16px_24px] bg-[#F9F9F9] hover:bg-black/5 transition-all text-[#0A2623] group select-none cursor-pointer"
                      >
                        <ShoppingBag size={16} className="text-[#0A2623]" />
                        <span className="flex-1 font-questrial text-[16px] font-normal leading-[130%]">My Orders</span>
                        <ArrowUpRight size={16} className="text-[#0A2623] opacity-55 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      {/* Line 27 */}
                      <div className="h-[1px] bg-black/10 self-stretch"></div>

                      {/* Support row (Frame 1618869797) */}
                      <a 
                        href="mailto:support@foodbridge.com"
                        onClick={() => setDropdownOpen(false)}
                        className="flex h-[53px] items-center gap-[12px] p-[16px_24px] bg-[#F9F9F9] hover:bg-black/5 transition-all text-[#0A2623] group select-none cursor-pointer"
                      >
                        <Headset size={16} className="text-[#0A2623]" />
                        <span className="flex-1 font-questrial text-[16px] font-normal leading-[130%]">Support</span>
                        <ArrowUpRight size={16} className="text-[#0A2623] opacity-55 group-hover:opacity-100 transition-opacity" />
                      </a>

                      {/* Line 26 */}
                      <div className="h-[1px] bg-black/10 self-stretch"></div>

                      {/* Log out row (Frame 1618869796) */}
                      <button 
                        onClick={() => { setDropdownOpen(false); handleLogout(); }}
                        className="flex h-[53px] w-full items-center gap-[12px] p-[16px_24px] bg-[#F9F9F9] hover:bg-[#EF4444]/5 transition-all text-[#EF4444] text-left cursor-pointer"
                      >
                        <LogOut size={16} className="text-[#EF4444]" />
                        <span className="font-questrial text-[16px] font-normal leading-[130%]">Log out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile menu toggle */}
            <button 
              className="lg:hidden p-1.5 text-[#0F3934] cursor-pointer" 
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </motion.div>
      </nav>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FFFDF2] z-[100] lg:hidden flex flex-col p-5 overflow-hidden"
          >
            <div className="w-full bg-white border border-[#0000001A] h-[65px] rounded-full px-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <img src="/images/homepage/logo.svg" alt="FoodBridge Logo" className="h-8 w-auto" />
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-[#0A2623] p-1">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center gap-6 my-[3rem]">
              <span className="text-[#0A2623]/40 font-questrial text-[14px]">Ilorin, Kwara</span>
              <div className="flex flex-col w-full max-w-[280px] gap-2">
                <Link to="/listings" onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-full border border-black/10 text-[#0A2623] text-[16px] font-questrial hover:bg-black/5 transition-all">
                  Explore Listings
                </Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-full border border-black/10 text-[#0A2623] text-[16px] font-questrial hover:bg-black/5 transition-all">
                  My Orders
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3.5 rounded-full border border-black/10 text-[#0A2623] text-[16px] font-questrial hover:bg-black/5 transition-all">
                  My Profile
                </Link>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex flex-col gap-4 w-full max-w-[320px] mx-auto mb-6 z-10">
              <button 
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-center py-3.5 rounded-full bg-state-error text-white text-[16px] font-normal font-questrial"
              >
                Sign Out
              </button>
            </div>

            {/* Bottom Bridge Illustration Graphic */}
            <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none flex justify-center z-0">
              <img 
                src="/images/homepage/hero-bottom.svg" 
                alt="Bridge Landscape graphic" 
                className="w-full object-cover native-bottom max-h-[180px]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
