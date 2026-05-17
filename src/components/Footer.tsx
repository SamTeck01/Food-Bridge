import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thanks for subscribing to our newsletter!', {
      style: { background: '#0F3934', color: '#7AD371', borderRadius: '12px' },
    });
    setEmail('');
  };

  const starVariants: Variants = {
    initial: { rotate: 0, scale: 1 },
    animate: { 
      rotate: 360, 
      transition: { duration: 8, repeat: Infinity, ease: "linear" } 
    },
    hover: { scale: 1.2, filter: "brightness(1.5)" }
  };

  return (
    <footer className="bg-[#0F0F0F] text-white border border-[#FFFFFF4D]">
      <Toaster position="top-right" />
      
      {/*Newsletter Section */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 border-b border-[#FFFFFF4D]">
        <div className="p-6 my-auto pl-[8rem] flex text-right items-end">
          <h2 className="text-[1.6rem] font-normal leading-tight">Subscribe to<br />Our Newsletter</h2>
        </div>
        <div className="col-span-1 md:col-span-2 p-8 md:p-12 border-x border-[#FFFFFF4D] flex items-center">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full bg-transparent border-none text-xl text-white placeholder:text-[#FFFFFF4D] focus:outline-none focus:ring-0 autofill:bg-transparent"
            style={{
              WebkitBoxShadow: '0 0 0px 1000px #0F0F0F inset',
              WebkitTextFillColor: '#FFFFFF',
            }}
          />
        </div>
        <div className="p-8 md:p-12 flex items-center justify-center">
          <button 
            onClick={handleSubscribe}
            className="px-10 py-4 bg-[#7AD371] text-[#0A2623] hover:text-white rounded-full text-[1rem] font-light hover:bg-[#1A4A3F] hover:scale-105 transition-all duration-300 flex items-center gap-3 group"
          >
            Subscribe 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Star Row */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-3 md:grid-cols-6 border-b border-[#FFFFFF4D] overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-center py-[1.5rem]">
            <motion.img 
              src="/images/star-icon.svg" 
              variants={starVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="size-[2.5rem]"
            />
          </div>
        ))}
      </div>

      {/*Main Footer Content */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4">
        {/* Brand Column */}
        <div className="p-6 md:p-8 border-r border-[#FFFFFF4D] border-b md:border-b-0">
          <img src="/images/white_logo.svg" alt="FoodBridge" className="h-10 mb-[1.44rem]" />
          <p className="text-[#FFFFFFB2] text-base leading-relaxed mb-[1.44rem]">
            FoodBridge connects verified food businesses with communities to rescue surplus meals, cut waste, and make quality food accessible.
          </p>
          <p className="text-[#FFFFFF4D]">Copyright © 2026 FoodBridge. All rights reserved.</p>
        </div>

        {/* Links Columns */}
        <FooterColumn title="Social" links={[
          { label: 'Twitter', icon: '/images/icons/twitter.svg', href: '#' },
          { label: 'Facebook', icon: '/images/icons/facebook.svg', href: '#' },
          { label: 'Instagram', icon: '/images/icons/instagram.svg', href: '#' },
          { label: 'LinkedIn', icon: '/images/icons/linkedin.svg', href: '#' },
        ]} showIcons border />
        
        <FooterColumn title="Company" links={[
          { label: 'Home', href: '/' },
          { label: 'Vendors', href: '/vendors' },
          { label: 'Individuals', href: '/individuals' },
          { label: 'About', href: '/about' },
        ]} border />

        <FooterColumn title="Support" links={[
          { label: 'FAQs', href: '/faqs' },
          { label: 'Contact', href: '/contact' },
          { label: 'Cookie policy', href: '/cookies' },
          { label: 'Privacy Policy', href: '/privacy' },
        ]} />
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links, showIcons, border }: any) => (
  <div className={`p-8 md:p-12 ${border ? 'border-r border-[#FFFFFF4D] border-b md:border-b-0' : ''}`}>
    <h3 className="text-[#FFFFFF] mb-8 font-medium">{title}</h3>
    <ul className="space-y-4">
      {links.map((link: any) => (
        <li key={link.label}>
          <motion.a 
            href={link.href}
            className="text-white text-base flex items-center gap-2 group relative w-fit hover:text-[#7AD371]"
          >
            {showIcons && <img src={link.icon} className="size-[1.125rem]" alt={title} />}
            {link.label}
            {/* Shooting Star Underline */}
            <motion.span 
              initial={{ scaleX: 0, x: -10 }}
              whileHover={{ scaleX: 1, x: 0 }}
              className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#7AD371] origin-left"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </motion.a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;