import { Link } from 'react-router-dom';
import Logo from './Logo';
import { ArrowRight, Leaf } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0A2623] text-white">

      {/* Newsletter strip */}
      <div className="border-b border-white/10 px-6 md:px-16">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center gap-6 py-10">
          <div className="flex-shrink-0 text-center sm:text-left">
            <p className="font-questrial text-xs text-white/40 uppercase tracking-wider mb-1">Stay updated</p>
            <h3 className="font-questrial text-2xl text-white">Subscribe to Our Newsletter</h3>
          </div>

          <div className="hidden sm:block w-px h-16 bg-white/15 flex-shrink-0 mx-6" />

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-1 items-center gap-3 min-w-0 max-w-xl"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-transparent font-questrial text-base text-white placeholder:text-white/30 outline-none border-b border-white/20 pb-1 focus:border-brand-primary transition-colors min-w-0"
            />
            <button
              type="submit"
              className="flex-shrink-0 flex items-center gap-2 h-10 px-5 rounded-full bg-brand-primary text-[#0A2623] font-questrial text-sm hover:bg-[#69C161] hover:shadow-lg transition-all active:scale-[0.97]"
            >
              Subscribe <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer content */}
      <div className="px-6 md:px-16 py-16 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <Logo className="brightness-0 invert opacity-90" />
            <p className="font-questrial text-sm text-white/60 leading-relaxed">
              FoodBridge connects verified food businesses with communities to rescue surplus meals, cut waste, and make quality food accessible to all.
            </p>
            <div className="flex items-center gap-2 text-brand-primary">
              <Leaf size={14} />
              <span className="font-questrial text-xs text-brand-primary/80">Fighting food waste since 2024</span>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4">
            <span className="font-questrial text-xs text-white/40 uppercase tracking-wider">Social</span>
            {['Twitter / X', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok'].map((item) => (
              <a key={item} href="#" className="font-questrial text-sm text-white/70 hover:text-brand-primary transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Company */}
          <div className="flex flex-col gap-4">
            <span className="font-questrial text-xs text-white/40 uppercase tracking-wider">Company</span>
            {[
              { label: 'For Individuals', to: '/listings' },
              { label: 'For Businesses', to: '/get-started' },
              { label: 'About Us', to: '#' },
              { label: 'FAQs', to: '#' },
              { label: 'Contact', to: '#' },
            ].map((item) => (
              <Link key={item.label} to={item.to} className="font-questrial text-sm text-white/70 hover:text-brand-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <span className="font-questrial text-xs text-white/40 uppercase tracking-wider">Legal</span>
            {['Cookie Policy', 'Privacy Policy', 'Terms of Service', 'DSA Disclosure'].map((item) => (
              <a key={item} href="#" className="font-questrial text-sm text-white/70 hover:text-brand-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 md:px-16 py-5">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-questrial text-xs text-white/30">
            © {year} FoodBridge. All rights reserved.
          </p>
          <p className="font-questrial text-xs text-white/20">
            Made with 💚 in Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
