import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Vendors', path: '/vendors' },
    { name: 'Individuals', path: '/individuals' },
    { name: 'Contact Us', path: '/contact' },
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
          <div className="hidden md:flex items-center gap-[2rem]">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[16px] font-normal transition-colors relative py-2 block ${
                    isActive ? 'text-[#7AD371]' : 'text-[#0A2623] hover:text-[#7AD371]'
                  }`}
                >
                  {link.name}
                  {/* Desktop Scribble Underline (Shows on Active or Hover) */}
                  <div 
                    className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-[110%] h-[10px] bg-[#7AD371] transition-all duration-300 origin-center pointer-events-none ${
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'
                    }`}
                    style={{
                      WebkitMaskImage: 'url("/images/scribble-underline.svg")',
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskImage: 'url("/images/scribble-underline.svg")',
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-[16px] font-normal text-[#0A2623B2] px-[1.5rem] py-[0.59rem] hover:bg-[#0F3934] hover:text-white rounded-full transition-all border border-[#0000001A]"
            >
              Vendor Login
            </Link>
            <Link 
              to="/get-started" 
              className="bg-[#0F3934] text-white px-[1.5rem] py-[0.59rem] rounded-full text-[15px] font-medium border border-[#0000001A] hover:bg-transparent hover:text-[#0A2623B2] transition-all"
            >
              Get Started
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

      {/* Mobile Full Screen Menu Context */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#FFFDF2] z-[100] md:hidden flex flex-col p-5 overflow-hidden"
          >
            <div className="w-full bg-white border border-[#0000001A] h-[65px] rounded-full px-6 flex items-center justify-between shadow-sm">
              <img src="/images/homepage/logo.svg" alt="FoodBridge Logo" className="h-8 w-auto" />
              <button onClick={() => setIsOpen(false)} className="text-[#0A2623] p-1">
                <X size={24} />
              </button>
            </div>

            {/* Vertically and Horizontally Centered Links */}
            <div className="flex flex-col items-center justify-center gap-6 my-[2rem]">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-[1rem] font-normal tracking-wide relative block ${
                      isActive ? 'text-brand-primary' : 'text-brand-secondary'
                    }`}
                  >
                    {link.name}
                    {/* Mobile Scribble Underline */}
                    <div 
                      className={`absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-[120%] h-[12px] bg-[#7AD371] transition-transform duration-200 ${
                        isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                      }`}
                      style={{
                        WebkitMaskImage: 'url("/images/scribble-underline.svg")',
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskImage: 'url("/images/scribble-underline.svg")',
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                      }}
                    />
                  </Link>
                );
              })}
            </div>

            {/* CTA Buttons*/}
            <div className="flex flex-col gap-4 w-full max-w-[320px] mx-auto mb-6 z-10">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3.5 rounded-full border border-[#0A262333] text-[16px] font-normal text-[#0A2623] bg-transparent hover:bg-neutral-50 transition-colors"
              >
                Vendor Login
              </Link>
              <Link 
                to="/get-started" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3.5 rounded-full bg-brand-secondary text-white text-[16px] font-normal transition-opacity active:opacity-90"
              >
                Get Started
              </Link>
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
};

export default Navbar;