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
    <footer className="bg-[#0F0F0F] text-white border-t border-[#FFFFFF4D]">
      <Toaster position="top-right" />
      
      {/* Newsletter Section */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 border-b border-[#FFFFFF4D]">
        {/* Adjusted responsive padding here - replacing pl-[8rem] */}
        <div className="p-6 md:p-8 lg:pl-16 flex items-center">
          <h2 className="text-[1.5rem] font-normal leading-tight">Subscribe to<br />Our Newsletter</h2>
        </div>
        
        {/* Border structure adjusted for responsive collapses */}
        <div className="col-span-1 md:col-span-2 p-6 md:p-8 border-y md:border-y-0 md:border-x border-[#FFFFFF4D] flex items-center">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full bg-transparent border-none text-lg text-white placeholder:text-[#FFFFFF4D] focus:outline-none focus:ring-0 autofill:bg-transparent"
            style={{
              WebkitBoxShadow: '0 0 0px 1000px #0F0F0F inset',
              WebkitTextFillColor: '#FFFFFF',
            }}
          />
        </div>
        
        <div className="p-6 md:p-8 flex items-center justify-center">
          <button 
            onClick={handleSubscribe}
            className="w-full sm:w-auto px-10 py-4 bg-[#7AD371] text-[#0A2623] hover:text-white rounded-full text-[1rem] font-medium hover:bg-[#1A4A3F] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            Subscribe 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Star Row - Now Hidden on Mobile using 'hidden sm:grid' */}
      <div className="max-w-[1440px] mx-auto hidden sm:grid grid-cols-6 border-b border-[#FFFFFF4D] overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-center py-[1.5rem] border-r border-[#FFFFFF4D] last:border-r-0">
            <motion.img 
              src="/images/star-icon.svg" 
              variants={starVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="size-[2rem]"
              alt="Decorative star"
            />
          </div>
        ))}
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3">
        
        {/* Brand Column */}
        <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[#FFFFFF4D]">
          <img src="/images/white_logo.svg" alt="FoodBridge" className="h-8 mb-[1.2rem]" />
          <p className="text-[#FFFFFFB2] text-sm leading-relaxed mb-[1.2rem] max-w-sm">
            FoodBridge connects verified food businesses with communities to rescue surplus meals, cut waste, and make quality food accessible.
          </p>
          <p className="text-[#FFFFFF4D] text-xs">Copyright © 2026 FoodBridge. All rights reserved.</p>
        </div>

        {/* Links Container Layout (Socials, Company, Support) */}
        {/* On mobile and tablet, this splits into 2 columns side-by-side instead of stacking tall */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-2 md:grid-cols-3">
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

          {/* Span full row width only on small dynamic breakpoints if needed, or clean 3rd column */}
          <div className="col-span-2 md:col-span-1 border-t border-[#FFFFFF4D] md:border-t-0">
            <FooterColumn title="Support" links={[
              { label: 'FAQs', href: '/faqs' },
              { label: 'Contact', href: '/contact' },
              { label: 'Cookie policy', href: '/cookies' },
              { label: 'Privacy Policy', href: '/privacy' },
            ]} />
          </div>
        </div>

      </div>
    </footer>
  );
};

interface FooterColumnProps {
  title: string;
  links: Array<{ label: string; href: string; icon?: string }>;
  showIcons?: boolean;
  border?: boolean;
}

const FooterColumn = ({ title, links, showIcons, border }: FooterColumnProps) => (
  <div className={`p-6 md:p-8 h-full ${border ? 'border-r border-[#FFFFFF4D]' : ''}`}>
    <h3 className="text-[#FFFFFF4D] text-xs uppercase tracking-wider mb-6 font-semibold">{title}</h3>
    <ul className="space-y-3.5">
      {links.map((link) => (
        <li key={link.label}>
          <motion.a 
            href={link.href}
            className="text-white/80 text-sm md:text-base flex items-center gap-2 group relative w-fit hover:text-[#7AD371] transition-colors duration-200"
          >
            {showIcons && link.icon && (
              <img src={link.icon} className="size-[1.1rem] opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
            )}
            <span>{link.label}</span>
            
            {/* Fine-tuned shooting star animation logic */}
            <motion.span 
              className="absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-[#7AD371] origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
            />
          </motion.a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;