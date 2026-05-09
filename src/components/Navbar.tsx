import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Individuals', path: '/listings' },
    { name: 'Vendors', path: '/vendors' },
  ];

  return (
    <>
      <nav className="top-6 left-0 right-0 z-50 md:px-[5rem] px-6 mt-[2rem]">
        {/* Main Navbar Container */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-[77.5rem] mx-auto bg-[#FFFFFF] backdrop-blur-md border border-[#0000001A] h-[65px] rounded-full px-[2rem] flex items-center justify-between shadow-sm "
        >
          {/* Logo */}
          <Link to="/">
            <img src="/images/homepage/logo.svg" alt="FoodBridge Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-[1.5rem]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[16px] font-normal transition-colors ${
                  pathname === link.path ? 'text-[#0A2623]' : 'text-[#0A2623] hover:text-[#7AD371]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-[16px] font-normal text-[#0A2623B2] px-[1.5rem] py-[0.59rem] hover:bg-[#0F3934] hover:text-white rounded-full transition-all border border-[#0000001A]"
            >
              Store login
            </Link>
            <Link 
              to="/get-started" 
              className="bg-[#0F3934] text-white px-[1.5rem] py-[0.59rem] rounded-full text-[15px] font-medium border border-[#0000001A] hover:bg-transparent hover:text-[#0A2623B2] transition-all"
            >
              Login
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-[#0F3934]" 
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} />
          </button>
        </motion.div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
            />

            {/* Sidebar Drawer */}
<motion.div
  initial={{ x: '-100%' }}
  animate={{ x: 0 }}
  exit={{ x: '-100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
  className="fixed top-0 left-0 h-[92dvh] w-[80%] max-w-[300px] bg-white z-[70] shadow-2xl md:hidden flex flex-col p-8 overflow-y-auto"
>
  <div className="flex items-center justify-between mb-12 flex-shrink-0">
    <img src="/images/homepage/logo.svg" alt="Logo" className="h-8 w-auto" />
    <button onClick={() => setIsOpen(false)} className="text-[#0F3934]">
      <X size={24} />
    </button>
  </div>

  <div className="flex flex-col gap-8 flex-grow">
    {navLinks.map((link) => (
      <Link
        key={link.name}
        to={link.path}
        onClick={() => setIsOpen(false)}
        className="text-[16px] font-normal text-[#0A2623] relative group"
      >
        {link.name}
        <span className="absolute -bottom-2 left-0 h-[1px] bg-[#0000001A] w-full" />
      </Link>
    ))}
  </div>

  {/* Mobile Auth Actions*/}
  <div className="mt-auto flex flex-col gap-4 pt-8 pb-4 flex-shrink-0">
    <Link 
      to="/login" 
      onClick={() => setIsOpen(false)}
      className="w-full text-center py-3 rounded-full border border-[#0000001A] text-[16px] font-normal text-[#0A2623B2]"
    >
      Store login
    </Link>
    <Link 
      to="/get-started" 
      onClick={() => setIsOpen(false)}
      className="w-full text-center py-3 rounded-full bg-[#0F3934] text-white text-[16px] font-normal shadow-lg shadow-[#0F3934]/20"
    >
      Login
    </Link>
  </div>
</motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;