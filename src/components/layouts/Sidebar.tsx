import { motion } from 'framer-motion';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { name: 'Home', icon: '/images/icons/home.svg', path: '/vendor/dashboard' },
  { name: 'Listings', icon: '/images/icons/listings.svg', path: '/vendor/listings' },
  { name: 'Impact', icon: '/images/icons/impact.svg', path: '/vendor/impact' },
  { name: 'Profile', icon: '/images/icons/profile.svg', path: '/vendor/profile' },
  { name: 'Post', icon: '/images/icons/plus.svg', path: '/vendor/post-listing', isPost: true },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div 
      initial={{ width: 250 }}
      animate={{ width: isOpen ? 250 : 80 }}
      className="hidden md:flex flex-col h-screen bg-white sticky top-0 transition-[width] duration-300 py-[2.25rem] px-[0.6rem]"
    >
      {/* Header Area: Logo + Toggle */}
      <div className="h-[2rem] flex items-center justify-between px-[1.2rem]">
        {isOpen && <img src="/images/homepage/logo.svg" alt="Food Bridge" className="h-8" />}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-full hover:bg-bg transition-colors"
        >
          <img src={isOpen ? "/images/icons/expand.svg" : "/images/icons/expand.svg"} alt="Toggle" className="w-6 h-6" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 p-3 rounded-xl transition-all font-questrial
              ${item.isPost 
                ? 'mt-8 border border-brand-primary text-brand-primary hover:bg-brand-primary/5' 
                : isActive 
                  ? 'bg-brand-primary/10 text-brand-secondary' 
                  : 'text-text-secondary hover:bg-bg'
              }
            `}
          >
            <img src={item.icon} alt={item.name} className="w-5 h-5" />
            {isOpen && <span>{item.name} {item.isPost && "+"}</span>}
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
}