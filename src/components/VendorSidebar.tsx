import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Home, Utensils, Sprout, User } from 'lucide-react';

const NAV = [
  { label: 'Home', path: '/vendor/dashboard', Icon: Home },
  { label: 'Listings', path: '/vendor/listings', Icon: Utensils },
  { label: 'Impact', path: '/vendor/impact', Icon: Sprout },
  { label: 'Profile', path: '/vendor/profile', Icon: User },
];

export default function VendorSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed left-0 top-0 h-full w-[250px] bg-white border-r border-black/[0.06] flex flex-col gap-6 px-8 py-9 z-40">
      {/* Logo */}
      <div className="flex items-center justify-between">
        <Link to="/">
          <img src="/images/homepage/logo.svg" alt="FoodBridge" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-2">
        {NAV.map(item => {
          const active = pathname === item.path || pathname.startsWith(item.path + '/');
          const IconComponent = item.Icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-[10px] font-questrial text-[16px] transition-all ${
                active
                  ? 'bg-[#F9F9F9] text-[#0A2623] font-semibold'
                  : 'text-[rgba(10,38,35,0.6)] hover:bg-[#F9F9F9] hover:text-[#0A2623]'
              }`}
            >
              <IconComponent size={20} className={active ? 'text-[#7AD371]' : 'text-[rgba(10,38,35,0.4)]'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Post Button */}
      <button
        onClick={() => navigate('/vendor/post-listing')}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-black/10 bg-[#F9F9F9] hover:bg-[#0F3934] hover:text-white hover:border-transparent text-[#0A2623] font-questrial text-[16px] transition-all group w-full"
      >
        <span>Post</span>
        <Plus size={18} className="text-[rgba(10,38,35,0.7)] group-hover:text-white transition-colors" />
      </button>
    </div>
  );
}

